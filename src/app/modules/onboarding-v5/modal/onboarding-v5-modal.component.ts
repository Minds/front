import { Component, OnDestroy, OnInit } from '@angular/core';
import { OnboardingV5Service } from '../services/onboarding-v5.service';
import { Subscription, take } from 'rxjs';

/**
 * Onboarding V5 modal component. Contains the onboarding V5 component and
 * acts as a wrapper handling functionality related to the display state and
 * configuration of the modal.
 */
@Component({
  selector: 'm-onboardingV5Modal',
  template: `
    <m-onboardingV5></m-onboardingV5>
  `,
  styleUrls: ['onboarding-v5-modal.component.ng.scss'],
})
export class OnboardingV5ModalComponent implements OnInit, OnDestroy {
  /** subscription to calls to dismissal. */
  private dismissSubscription: Subscription;

  constructor(private service: OnboardingV5Service) {}

  ngOnInit(): void {
    this.dismissSubscription = this.service.dismiss$
      .pipe(take(1))
      .subscribe((dismiss: boolean): void => {
        this.onDismissIntent();
      });
  }

  ngOnDestroy(): void {
    this.dismissSubscription?.unsubscribe();
  }

  /**
   * Get modal options - can dismiss is fixed to false so that only direct
   * programmatic calls to dismiss will dismiss the modal.
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
   * Set the modal data - note, params listed are destructured.
   * @param { Function } onDismissIntent - on dismiss intent function.
   */
  public setModalData({ onDismissIntent }: { onDismissIntent: () => void }) {
    this.onDismissIntent = onDismissIntent ?? (() => {});
  }

  /**
   * Dismiss intent - set via modal options.
   * @returns { void }
   */
  private onDismissIntent: () => void = () => {};
}
