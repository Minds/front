import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  ComponentOnboardingV5CarouselItem,
  ComponentOnboardingV5CompletionStep,
  FetchOnboardingV5VersionsGQL,
  FetchOnboardingV5VersionsQuery,
  OnboardingV5Version,
} from '../../../../graphql/generated.strapi';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  catchError,
  distinctUntilChanged,
  firstValueFrom,
  map,
  of,
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
  KeyValuePairInput,
  SetOnboardingStateGQL,
  SetOnboardingStateMutation,
} from '../../../../graphql/generated.engine';
import { MutationResult } from 'apollo-angular';

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

  public readonly dismiss$: Subject<boolean> = new Subject<boolean>();

  private stepsGqlSubscription: Subscription;
  private completionStepShowSubscription: Subscription;
  private dismissalSubscription: Subscription;

  constructor(
    private stepsGql: FetchOnboardingV5VersionsGQL,
    private authRedirect: AuthRedirectService,
    private setOnboardingStateGQL: SetOnboardingStateGQL,
    private completeOnboardingStepGQL: CompleteOnboardingStepGQL,
    @Inject(STRAPI_URL) public strapiUrl: string
  ) {}

  private async startOnboarding(): Promise<
    MutationResult<SetOnboardingStateMutation>
  > {
    return firstValueFrom(
      this.setOnboardingStateGQL.mutate({ completed: false })
    );
  }

  private async completeOnboarding(): Promise<
    MutationResult<SetOnboardingStateMutation>
  > {
    return firstValueFrom(
      this.setOnboardingStateGQL.mutate({ completed: true })
    );
  }

  public fetchSteps(): void {
    this.stepsGqlSubscription = this.stepsGql
      .fetch()
      .pipe(
        take(1),
        catchError((e: unknown) => {
          console.error(e);
          return of(null);
        })
      )
      .subscribe(
        (response: ApolloQueryResult<FetchOnboardingV5VersionsQuery>) => {
          this.stepFetchInProgress$.next(false);

          const cmsData: OnboardingV5Version = response?.data
            ?.onboardingV5Versions?.data[0].attributes as OnboardingV5Version;

          if (cmsData?.steps) {
            let steps: OnboardingStep[] = [];
            for (let stepData of cmsData.steps) {
              if (stepData.__typename === 'Error') {
                console.error(stepData);
                continue;
              }
              stepData = stepData;
              steps.push({
                completed: false,
                stepType: stepData.stepType,
                data: stepData,
              });
            }
            this.startOnboarding();
            this.steps$.next(steps);
            this.activeStep$.next(this.getActiveStepFromSteps(steps));
          } else {
            this.authRedirect.redirect();
            this.dismiss$.next(true);
          }

          if (cmsData?.completionStep) {
            this.completionStep$.next(cmsData.completionStep);
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.stepsGqlSubscription?.unsubscribe();
    this.completionStepShowSubscription?.unsubscribe();
    this.dismissalSubscription?.unsubscribe();
  }

  private getActiveStepFromSteps(steps: OnboardingStep[]): OnboardingStep {
    const activeSteps: OnboardingStep[] = steps.filter(
      (step: OnboardingStep): boolean => {
        return !step.completed;
      }
    );
    return activeSteps.length ? activeSteps[0] : steps[0];
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
    try {
      this.completeOnboarding();
    } catch (e) {
      console.error(e);
    }

    this.completionStepShowSubscription = timer(1000)
      .pipe(take(1))
      .subscribe(() => {
        this.onboardingCompleted$.next(true);

        this.dismissalSubscription = timer(1200).subscribe(() => {
          this.dismiss$.next(true);
        });
      });
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
