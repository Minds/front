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

@Injectable({
  providedIn: 'root',
})
export class OnboardingV5Service implements OnDestroy {
  public readonly stepFetchInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(true);

  public readonly steps$: BehaviorSubject<
    OnboardingStep[]
  > = new BehaviorSubject<OnboardingStep[]>(null);

  public readonly activeStep$: BehaviorSubject<
    OnboardingStep
  > = new BehaviorSubject<OnboardingStep>(null);

  public readonly completionStep$: BehaviorSubject<
    ComponentOnboardingV5CompletionStep
  > = new BehaviorSubject<ComponentOnboardingV5CompletionStep>(null);

  public readonly onboardingCompleted$: Subject<boolean> = new Subject<
    boolean
  >();

  public readonly completionInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  public readonly dismiss$: Subject<boolean> = new Subject<boolean>();

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

  private readonly releaseTimestamp: number;
  private skipOnboardingProgressCheck: boolean = false;
  private dismissalSubscription: Subscription;
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

  public async hasCompletedOnboarding(): Promise<boolean> {
    try {
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

  public async setOnboardingCompletedState(
    completed = false
  ): Promise<MutationResult<SetOnboardingStateMutation>> {
    // if completed, set it in local storage.
    if (completed) {
      this.completionStorage.setAsCompleted(
        this.session.getLoggedInUser().guid
      );
    } else {
      this.skipOnboardingProgressCheck = true;
    }

    return firstValueFrom(
      this.setOnboardingStateGQL.mutate({ completed: completed })
    );
  }

  public async start(): Promise<void> {
    let stepProgressResponse: ApolloQueryResult<GetOnboardingStepProgressQuery>;

    try {
      if (!this.skipOnboardingProgressCheck) {
        stepProgressResponse = await firstValueFrom(
          this.getOnboardingStepProgressGQL.fetch()
        );
      }

      const stepsResponse: ApolloQueryResult<FetchOnboardingV5VersionsQuery> = await firstValueFrom(
        this.fetchOnboardingV5VersionsGql.fetch()
      );

      const cmsData: OnboardingV5Version = stepsResponse?.data
        ?.onboardingV5Versions?.data[0].attributes as OnboardingV5Version;

      if (cmsData?.steps) {
        this.parseSteps(
          cmsData.steps,
          stepProgressResponse?.data?.onboardingStepProgress
        );

        if (cmsData?.completionStep) {
          this.completionStep$.next(cmsData.completionStep);
        }
      } else {
        throw new Error('No steps found');
      }
    } catch (e) {
      console.error(e);
      this.authRedirect.redirect();
      this.dismiss$.next(true);
    } finally {
      this.stepFetchInProgress$.next(false);
    }
  }

  public continue(additionalData: Object = null): void {
    const currentlyActiveStep: OnboardingStep = this.activeStep$.getValue();

    this.completeOnboardingStep(
      currentlyActiveStep.stepType,
      currentlyActiveStep.data.stepKey,
      additionalData
    );

    let steps: OnboardingStep[] = this.steps$.getValue();

    for (let i = 0; i < steps.length; i++) {
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

  public isPreOnboardingV5ReleaseUser(user: MindsUser): boolean {
    return user.time_created < this.releaseTimestamp;
  }

  private parseSteps(
    stepsData: OnboardingV5VersionStepsDynamicZone[],
    stepProgressData: OnboardingStepProgressState[] = null
  ) {
    let onboardingSteps: OnboardingStep[] = [];

    for (let stepData of stepsData) {
      if (stepData.__typename === 'Error') {
        console.error(stepData);
        continue;
      }

      let onboardingStep = this.buildStepData(stepData, stepProgressData);

      onboardingSteps.push(onboardingStep);
    }

    onboardingSteps = onboardingSteps.sort(
      (a: OnboardingStep, b: OnboardingStep): number => {
        return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
      }
    );

    this.steps$.next(onboardingSteps);
    this.activeStep$.next(this.getActiveStepFromSteps(onboardingSteps));
  }

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
      let stepProgress: OnboardingStepProgressState = stepProgressData.find(
        (stepProgress: OnboardingStepProgressState): boolean => {
          return stepProgress.stepKey === onboardingStep.data?.stepKey;
        }
      );

      if (stepProgress) {
        onboardingStep.completed = Boolean(stepProgress.completedAt);
      }
    }

    return onboardingStep;
  }

  private getActiveStepFromSteps(steps: OnboardingStep[]): OnboardingStep {
    const activeSteps: OnboardingStep[] = steps.filter(
      (step: OnboardingStep): boolean => {
        return !step.completed;
      }
    );
    return activeSteps.length ? activeSteps[0] : steps[0];
  }

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
