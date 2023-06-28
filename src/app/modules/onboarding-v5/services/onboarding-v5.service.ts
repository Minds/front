import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  ComponentOnboardingV5CarouselItem,
  ComponentOnboardingV5CompletionStep,
  ComponentOnboardingV5OnboardingStep,
  FetchOnboardingV5VersionsGQL,
  FetchOnboardingV5VersionsQuery,
  OnboardingV5Version,
  OnboardingV5VersionStepsDynamicZone,
} from '../../../../graphql/generated.strapi';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  distinctUntilChanged,
  firstValueFrom,
  map,
  take,
  timer,
} from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { OnboardingStep } from '../types/onboarding-v5.types';
import { CarouselItem } from '../../../common/components/feature-carousel/feature-carousel.component';
import { STRAPI_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { AuthRedirectService } from '../../../common/services/auth-redirect.service';
import {
  CompleteOnboardingStepGQL,
  CompleteOnboardingStepMutation,
  GetOnboardingStateGQL,
  GetOnboardingStateQuery,
  GetOnboardingStepProgressGQL,
  GetOnboardingStepProgressQuery,
  KeyValuePairInput,
  OnboardingStepProgressState,
  SetOnboardingStateGQL,
  SetOnboardingStateMutation,
} from '../../../../graphql/generated.engine';
import { MutationResult } from 'apollo-angular';
import { ConfigsService } from '../../../common/services/configs.service';
import { MindsUser } from '../../../interfaces/entities';
import { OnboardingV5CompletionStorageService } from './onboarding-v5-completion-storage.service';
import { Session } from '../../../services/session';

/**
 * Service for the management of the onboarding (v5) process.
 */
@Injectable({
  providedIn: 'root',
})
export class OnboardingV5Service implements OnDestroy {
  /** Whether fetching steps is in progress. */
  public readonly stepFetchInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(true);

  /** Onboarding steps. */
  public readonly steps$: BehaviorSubject<
    OnboardingStep[]
  > = new BehaviorSubject<OnboardingStep[]>(null);

  /** Currently active onboarding step. */
  public readonly activeStep$: BehaviorSubject<
    OnboardingStep
  > = new BehaviorSubject<OnboardingStep>(null);

  /** Completion step to be shown after onboarding. */
  public readonly completionStep$: BehaviorSubject<
    ComponentOnboardingV5CompletionStep
  > = new BehaviorSubject<ComponentOnboardingV5CompletionStep>(null);

  /** Emits when onboarding is completed - shows the completion step. */
  public readonly onboardingCompleted$: Subject<boolean> = new Subject<
    boolean
  >();

  /** Whether completion step is in progress. */
  public readonly completionInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Emit to dismiss modal. */
  public readonly dismiss$: Subject<boolean> = new Subject<boolean>();

  /** Carousel items for currently active step. */
  public readonly activeStepCarouselItems$: Observable<
    CarouselItem[]
  > = this.activeStep$.pipe(
    distinctUntilChanged(),
    map((stepData: OnboardingStep) => {
      if (!stepData?.data?.carousel) {
        return [];
      }
      return stepData?.data?.carousel.map(
        (carouselItem: ComponentOnboardingV5CarouselItem): CarouselItem => {
          return {
            title: carouselItem.title,
            media: {
              fullUrl:
                this.strapiUrl + carouselItem?.media?.data?.attributes?.url,
              altText:
                carouselItem?.media?.data?.attributes?.alternativeText ??
                'Onboarding carousel image',
            },
          };
        }
      );
    })
  );

  /** Timestamp of Onboarding V5 release - users before this will not have their onboarding status checked. */
  private readonly releaseTimestamp: number;

  /** Should be true immediately after registration to avoid unnecessary call. */
  private firstLoad: boolean = false;

  /** Subscription to call for dismissal of modal. */
  private dismissalSubscription: Subscription;

  /** Subscription to completion step showing. */
  private completionStepShowSubscription: Subscription;

  constructor(
    private authRedirect: AuthRedirectService,
    private fetchOnboardingV5VersionsGql: FetchOnboardingV5VersionsGQL,
    private getOnboardingStateGQL: GetOnboardingStateGQL,
    private setOnboardingStateGQL: SetOnboardingStateGQL,
    private getOnboardingStepProgressGQL: GetOnboardingStepProgressGQL,
    private completeOnboardingStepGQL: CompleteOnboardingStepGQL,
    private completionStorage: OnboardingV5CompletionStorageService,
    private configs: ConfigsService,
    private session: Session,
    @Inject(STRAPI_URL) public strapiUrl: string
  ) {
    this.releaseTimestamp =
      this.configs.get('onboarding_v5_release_timestamp') ?? 0;
  }

  ngOnDestroy(): void {
    this.completionStepShowSubscription?.unsubscribe();
    this.dismissalSubscription?.unsubscribe();
  }

  /**
   * Whether the session logged in user has completed onboarding.
   * @returns { Promise<void> } true if completed.
   */
  public async hasCompletedOnboarding(): Promise<boolean> {
    try {
      // if we have set that this is the first time we are loading onboarding,
      // we can skip the checks and return false.
      if (this.firstLoad) {
        return false;
      }

      const loggedInUser: MindsUser = this.session.getLoggedInUser();

      // check whether we have marked it as completed in local storage already.
      const storedCompletionState: boolean = this.completionStorage.isCompleted(
        loggedInUser.guid
      );

      if (storedCompletionState) {
        return storedCompletionState;
      }

      // check whether user existed before onboarding v5 release.
      if (this.isPreOnboardingV5ReleaseUser(this.session.getLoggedInUser())) {
        this.completionStorage.setAsCompleted(loggedInUser.guid);
        return true;
      }

      // else get it from the server.
      const response: ApolloQueryResult<GetOnboardingStateQuery> = await firstValueFrom(
        this.getOnboardingStateGQL.fetch()
      );

      // if completed, set it in local storage.
      const completed: boolean = Boolean(
        response?.data?.onboardingState?.completedAt
      );

      if (completed) {
        this.completionStorage.setAsCompleted(loggedInUser.guid);
      }

      return completed;
    } catch (e) {
      console.error(e);
      return true; // presume true if there is an error getting state.
    }
  }

  /**
   * Set onboarding completed state via a mutation. On completion, will also
   * store in local storage to avoid having to make subsequent server calls
   * on browser reload. If false, sets skipOnboardingProgressCheck to true,
   * so that the onboarding progress check is skipped on next load - which is
   * intended to be used to avoid an unnecessary server call during registration.
   * @param { boolean } completed - whether to set to completed or not.
   * @returns { Promise<MutationResult<SetOnboardingStateMutation>> } result.
   */
  public async setOnboardingCompletedState(
    completed: boolean = false
  ): Promise<MutationResult<SetOnboardingStateMutation>> {
    // if completed, set it in local storage.
    if (completed) {
      this.completionStorage.setAsCompleted(
        this.session.getLoggedInUser().guid
      );
    } else {
      // if not completed, skip progress check on next load.
      this.firstLoad = true;
    }

    return firstValueFrom(
      this.setOnboardingStateGQL.mutate({ completed: completed })
    );
  }

  /**
   * Start onboarding flow. Will resume from where a user left off unless
   * skipOnboardingProgressCheck is true.
   * @returns { Promise<void> }
   */
  public async start(): Promise<void> {
    let stepProgressResponse: ApolloQueryResult<GetOnboardingStepProgressQuery>;

    try {
      // try to get existing progress unless skipped.
      if (!this.firstLoad) {
        stepProgressResponse = await firstValueFrom(
          this.getOnboardingStepProgressGQL.fetch()
        );
      }

      // get steps from CMS.
      const stepsResponse: ApolloQueryResult<FetchOnboardingV5VersionsQuery> = await firstValueFrom(
        this.fetchOnboardingV5VersionsGql.fetch()
      );

      const cmsData: OnboardingV5Version = stepsResponse?.data
        ?.onboardingV5Versions?.data[0].attributes as OnboardingV5Version;

      if (cmsData?.steps) {
        // handle step data, init class with it.
        this.parseSteps(
          cmsData.steps,
          stepProgressResponse?.data?.onboardingStepProgress
        );

        // store completion step.
        if (cmsData?.completionStep) {
          this.completionStep$.next(cmsData.completionStep);
        }
      } else {
        throw new Error('No steps found');
      }
    } catch (e) {
      console.error(e);
      // redirect on fatal error and skip over onboarding.
      this.authRedirect.redirect();
      this.dismiss$.next(true);
    } finally {
      this.stepFetchInProgress$.next(false);
    }
  }

  /**
   * Continue to next step, or trigger completion if the last step has been reached.
   * @param { Object } additionalData - additional data from current step to be passed to the server.
   * @returns { void }
   */
  public continue(additionalData: Object = null): void {
    const currentlyActiveStep: OnboardingStep = this.activeStep$.getValue();

    this.completeOnboardingStep(
      currentlyActiveStep.stepType,
      currentlyActiveStep.data.stepKey,
      additionalData
    );

    let steps: OnboardingStep[] = this.steps$.getValue() ?? [];

    for (let i = 0; i < steps?.length; i++) {
      if (steps[i].stepType === currentlyActiveStep.stepType) {
        steps[i].completed = true;

        if (steps?.[i + 1]) {
          this.activeStep$.next(steps[i + 1]);
        } else {
          this.finishOnboarding();
        }

        break;
      }
    }
  }

  /**
   * Call to finish onboarding - will show completion step and then dismiss modal after fixed times.
   * @returns { void  }
   */
  public finishOnboarding(): void {
    this.completionInProgress$.next(true);
    try {
      this.setOnboardingCompletedState(true);
    } catch (e) {
      console.error(e);
    }

    this.completionStepShowSubscription = timer(1000)
      .pipe(take(1))
      .subscribe(() => {
        this.onboardingCompleted$.next(true);

        this.dismissalSubscription = timer(1200).subscribe(() => {
          this.completionInProgress$.next(false);
          this.dismiss$.next(true);
        });
      });
  }

  /**
   * Determine whether the user's account was created before the onboarding v5 release.
   * @param { MindsUser } user the user to check.
   * @returns { boolean } true if the user's account was created before the onboarding v5 release.
   */
  public isPreOnboardingV5ReleaseUser(user: MindsUser): boolean {
    return user.time_created < this.releaseTimestamp;
  }

  /**
   * Parse step data and progress data to set initial class state - including which steps have
   * already been completed so that we start in the correct place. WILL reorder completed steps
   * to the start in the event the order changes around.
   * @param { OnboardingV5VersionStepsDynamicZone[] } stepsData - steps data from CMS.
   * @param { OnboardingStepProgressState[] } stepProgressData - step progress data from server.
   * @returns { void }
   */
  private parseSteps(
    stepsData: OnboardingV5VersionStepsDynamicZone[],
    stepProgressData: OnboardingStepProgressState[] = null
  ): void {
    let onboardingSteps: OnboardingStep[] = [];

    for (let stepData of stepsData) {
      if (stepData.__typename === 'Error') {
        console.error(stepData);
        continue;
      }

      let onboardingStep = this.buildStepData(stepData, stepProgressData);

      onboardingSteps.push(onboardingStep);
    }

    // order steps by completed first.
    onboardingSteps = onboardingSteps.sort(
      (a: OnboardingStep, b: OnboardingStep): number => {
        return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
      }
    );

    // init local state.
    this.steps$.next(onboardingSteps);
    this.activeStep$.next(this.getActiveStepFromSteps(onboardingSteps));
  }

  /**
   * Build OnboardingStep from data.
   * @param { ComponentOnboardingV5OnboardingStep } stepData - step data from CMS.
   * @param { OnboardingStepProgressState } stepProgressData - step progress data from server.
   * @returns { OnboardingStep } the built step.
   */
  private buildStepData(
    stepData: ComponentOnboardingV5OnboardingStep,
    stepProgressData: OnboardingStepProgressState[] = null
  ): OnboardingStep {
    let onboardingStep: OnboardingStep = {
      completed: false,
      stepType: stepData.stepType,
      data: stepData,
    };

    if (stepProgressData?.length) {
      // if we have progress data for this step.
      let stepProgress: OnboardingStepProgressState = stepProgressData.find(
        (stepProgress: OnboardingStepProgressState): boolean => {
          return stepProgress.stepKey === onboardingStep.data?.stepKey;
        }
      );

      // set completed state appropriately.
      if (stepProgress) {
        onboardingStep.completed = Boolean(stepProgress.completedAt);
      }
    }

    return onboardingStep;
  }

  /**
   * Gets the step that should be active from steps.
   * @param { OnboardingStep } steps - onboarding steps to check.
   * @returns { OnboardingStep } - the active step.
   */
  private getActiveStepFromSteps(steps: OnboardingStep[]): OnboardingStep {
    const activeSteps: OnboardingStep[] = steps.filter(
      (step: OnboardingStep): boolean => {
        return !step.completed;
      }
    );
    return activeSteps.length ? activeSteps[0] : steps[0];
  }

  /**
   * Update the server to tell it that the user has completed a step via mutation.
   * @param { string } stepType - the type of the step.
   * @param { string } stepKey - the key of the step.
   * @param { Object } additionalData - additional data to be passed to the server.
   * @returns { Promise<MutationResult<CompleteOnboardingStepMutation>> } - result of mutation for setting users onboarding state.
   */
  private async completeOnboardingStep(
    stepType: string,
    stepKey: string,
    additionalData: Object = null
  ): Promise<MutationResult<CompleteOnboardingStepMutation>> {
    let additionalDataInput: KeyValuePairInput[] = [];
    if (additionalData) {
      for (const [key, value] of Object.entries(additionalData)) {
        additionalDataInput.push({
          key: key,
          value: value,
        });
      }
    }

    return firstValueFrom(
      this.completeOnboardingStepGQL.mutate({
        stepType: stepType,
        stepKey: stepKey,
        additionalData: additionalDataInput,
      })
    );
  }
}
