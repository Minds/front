import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Storage } from '../../../services/storage';
import { OnboardingStepName } from '../onboarding-v3.service';
import { OnboardingV3TagsService } from './tags/tags.service';

@Injectable({ providedIn: 'root' })
export class OnboardingV3PanelService implements OnDestroy {
  /**
   * Push new value to dismiss.
   */
  public readonly dismiss$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Current step of the modal
   */
  public readonly currentStep$: BehaviorSubject<
    OnboardingStepName
  > = new BehaviorSubject<OnboardingStepName>('SuggestedHashtagsStep');

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private tags: OnboardingV3TagsService,
    private storage: Storage
  ) {}

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Observable holding whether or not progress button should be visible.
   * @param { Observable<boolean> } - true if progress should be disabled.
   */
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

  /**
   * Either dismisses or progresses in steps
   * @returns { void }
   */
  public nextStep(): void {
    this.subscriptions.push(
      this.currentStep$.pipe(take(1)).subscribe(currentStep => {
        if (currentStep === 'SuggestedHashtagsStep') {
          // use storage rather than a Query param incase
          // user wants to share link.
          this.storage.set('show:welcome:modal', true);

          // navigate router to newsfeed
          this.router.navigate(['/newsfeed/subscriptions']);
        }
        this.dismiss$.next(true);
      })
    );
  }
}
