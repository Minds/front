import { Component, OnDestroy, OnInit } from '@angular/core';
import { OnboardingV5Service } from '../services/onboarding-v5.service';
import { Subscription, take } from 'rxjs';

export type OnboardingModalData = {
  onComplete: () => any;
  onDismissIntention: () => any;
};

/**
 * Onboarding V5 modal component. Contains the onboarding V5 component and
 * acts as a wrapper handling functionality related to the display state and
 * configuration of the modal.
 */
@Component({
  selector: 'm-onboardingV5Modal',
  template: ` <m-onboardingV5></m-onboardingV5> `,
  styleUrls: ['onboarding-v5-modal.component.ng.scss'],
})
export class OnboardingV5ModalComponent implements OnInit, OnDestroy {
  /** subscription to onboarding completion. */
  private completeSubscription: Subscription;

  /** subscription to calls to dismissal. */
  private dismissSubscription: Subscription;

  constructor(private service: OnboardingV5Service) {}

  ngOnInit(): void {
    this.completeSubscription = this.service.onboardingCompleted$
      .pipe(take(1))
      .subscribe((completed: boolean): void => {
        if (completed) {
          this.onComplete();
        }
      });

    this.dismissSubscription = this.service.dismiss$
      .pipe(take(1))
      .subscribe((dismiss: boolean): void => {
        this.onDismissIntention();
      });
  }

  ngOnDestroy(): void {
    this.completeSubscription?.unsubscribe();
    this.dismissSubscription?.unsubscribe();
  }

  /**
   * Get modal options - can dismiss is fixed to false so that only direct
   * programmatic calls to dismiss, will dismiss the modal.
   * @returns { { canDismiss: () => Promise<boolean> } } modal options.
   */
  public getModalOptions(): { canDismiss: () => Promise<boolean> } {
    return {
      canDismiss: async () => {
        return false;
      },
    };
  }

  /**
   * Set the modal data
   * @param { OnboardingModalData } data - data for onboarding modal
   */
  public setModalData({ onComplete, onDismissIntention }: OnboardingModalData) {
    this.onComplete = onComplete ?? (() => {});
    this.onDismissIntention = onDismissIntention ?? (() => {});
  }

  /**
   * On complete - set via modal options.
   * @returns { void }
   */
  private onComplete: () => void = () => {};

  /**
   * Dismiss intent - set via modal options.
   * @returns { void }
   */
  private onDismissIntention: () => void = () => {};
}
