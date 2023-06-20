import { Component, OnDestroy, OnInit } from '@angular/core';
import { OnboardingV5Service } from '../services/onboarding-v5.service';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { CarouselItem } from '../../../common/components/feature-carousel/feature-carousel.component';
import { OnboardingStep } from '../types/onboarding-v5.types';

@Component({
  selector: 'm-onboardingV5',
  templateUrl: './onboarding-v5.component.html',
  styleUrls: [
    'onboarding-v5.component.ng.scss',
    '../stylesheets/two-column-layout.ng.scss',
  ],
})
export class OnboardingV5Component implements OnInit, OnDestroy {
  public stepFetchInProgress$: Observable<boolean> = this.service
    .stepFetchInProgress$;

  public readonly carouselItems$: Observable<CarouselItem[]> = this.service
    .activeStepCarouselItems$;

  public readonly activeStep$: Observable<OnboardingStep> = this.service
    .activeStep$;

  public readonly onboardingCompleted$: Observable<boolean> = this.service
    .onboardingCompleted$;

  private popStateSubscription: Subscription;

  constructor(private service: OnboardingV5Service) {}

  ngOnInit(): void {
    this.service.fetchSteps();
    this.disableBackNavigation();
  }

  ngOnDestroy(): void {
    this.popStateSubscription?.unsubscribe();
  }

  private disableBackNavigation(): void {
    history.pushState(null, null, location.href);

    // prevent back button navigation.
    this.popStateSubscription = fromEvent(window, 'popstate').subscribe(
      (_: unknown): void => {
        history.pushState(null, null, location.href);
      }
    );
  }
}
