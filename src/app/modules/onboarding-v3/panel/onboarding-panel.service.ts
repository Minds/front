import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { OnboardingV3Service, StepName } from '../onboarding-v3.service';
import { OnboardingV3TagsService } from './tags/tags.service';

export type Tag = {
  selected: boolean;
  value: string;
  type: string;
};

@Injectable({ providedIn: 'root' })
export class OnboardingV3PanelService implements OnDestroy {
  private readonly steps: StepName[] = [
    'SuggestedHashtagsStep',
    'WelcomeStep',
    'VerifyEmailStep',
    'SetupChannelStep',
    'VerifyUniquenessStep',
    'CreatePostStep',
  ];

  public readonly currentStep$: BehaviorSubject<StepName> = new BehaviorSubject<
    StepName
  >(this.steps[0]);

  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private tags: OnboardingV3TagsService) {}

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  get disableProgress$(): Observable<boolean> {
    return combineLatest([this.currentStep$, this.tags.tags$]).pipe(
      map(([currentStep, tags]) => {
        if (currentStep === 'SuggestedHashtagsStep') {
          return tags.filter(tag => tag.selected).length < 3;
        }
        return false;
      })
    );
  }

  public nextStep() {
    const currentIndex = this.steps.indexOf(this.currentStep$.getValue());
    const nextStep = this.steps[currentIndex + 1];

    if (nextStep === 'WelcomeStep') {
      this.router.navigate([
        '/newsfeed/subscriptions',
        {
          onboarding: true,
          onboardingStep: 'WelcomeStep'.toLowerCase(),
        },
      ]);
    }
    this.currentStep$.next(nextStep);
  }
}
