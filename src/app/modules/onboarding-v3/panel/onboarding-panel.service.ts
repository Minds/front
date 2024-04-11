import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { Session } from '../../../services/session';
import { OnboardingStepName } from '../onboarding-v3.service';
import { OnboardingV3TagsService } from './tags/tags.service';

@Injectable({ providedIn: 'root' })
export class OnboardingV3PanelService implements OnDestroy {
  /**
   * Push new value to dismiss.
   */
  public readonly dismiss$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Current step of the modal
   */
  public readonly currentStep$: BehaviorSubject<OnboardingStepName> =
    new BehaviorSubject<OnboardingStepName>('SuggestedHashtagsStep');

  /**
   * Force completion of a step.
   */
  public readonly forceComplete$: BehaviorSubject<OnboardingStepName> =
    new BehaviorSubject<OnboardingStepName>(null);

  private subscriptions: Subscription[] = [];

  constructor(
    private tags: OnboardingV3TagsService,
    private router: Router,
    private session: Session
  ) {
    // fixes session bleed causing wrong panel to show at start.
    this.subscriptions.push(
      this.session.loggedinEmitter?.subscribe((user) => {
        if (user) {
          this.currentStep$.next('SuggestedHashtagsStep');
        }
      })
    );
  }

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
          return tags.filter((tag) => tag.selected).length < 3;
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
      this.currentStep$
        .pipe(
          take(1),
          catchError((e) => {
            console.error(e);
            return of(null);
          })
        )
        .subscribe((currentStep) => {
          if (currentStep === 'SuggestedHashtagsStep') {
            // this.currentStep$.next('WelcomeStep');
            // this.router.navigate(['/newsfeed/subscribed']);
            // return;
          }
          this.dismiss$.next(true);
        })
    );
  }
}
