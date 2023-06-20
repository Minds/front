import { Component, OnDestroy, OnInit } from '@angular/core';
import { OnboardingV5Service } from '../services/onboarding-v5.service';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'm-onboardingV5Modal',
  template: `
    <m-onboardingV5></m-onboardingV5>
  `,
  styleUrls: ['onboarding-v5-modal.component.ng.scss'],
})
export class OnboardingV5ModalComponent implements OnInit, OnDestroy {
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

  public getModalOptions(): { canDismiss: () => Promise<boolean> } {
    return {
      canDismiss: async () => {
        return false;
      },
    };
  }

  public setModalData({ onDismissIntent }: { onDismissIntent: () => void }) {
    this.onDismissIntent = onDismissIntent ?? (() => {});
  }

  /**
   * Dismiss intent - set via modal options.
   * @returns { void }
   */
  private onDismissIntent: () => void = () => {};
}
