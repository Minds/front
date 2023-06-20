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
    @Inject(STRAPI_URL) public strapiUrl: string
  ) {}

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

            this.steps$.next(steps);
            this.activeStep$.next(this.getActiveStepFromSteps(steps));
          } else {
            // TODO: Could we have a stubbed response.
            this.authRedirect.redirect();
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

  public continue(): void {
    const currentlyActiveStep: OnboardingStep = this.activeStep$.getValue();
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
    this.completionStepShowSubscription = timer(1000)
      .pipe(take(1))
      .subscribe(() => {
        this.onboardingCompleted$.next(true);

        this.dismissalSubscription = timer(1200).subscribe(() => {
          this.dismiss$.next(true);
        });
      });
  }
}
