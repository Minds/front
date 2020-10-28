import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { OnboardingStepName } from '../onboarding-v3.service';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';

/**
 * Onboarding modal component; core function as a connector,
 * and to switch between child panels.
 */
@Component({
  selector: 'm-onboardingProgress',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.ng.scss'],
})
export class OnboardingV3ModalComponent implements OnDestroy, OnInit {
  /**
   * Used to trigger next clicked event in subscribers.
   */
  public nextClicked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  private dismissSubscription: Subscription;

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  constructor(private panel: OnboardingV3PanelService) {}

  ngOnInit(): void {
    // Dismiss when panel service BehaviourSubject is pushed to.
    this.dismissSubscription = this.panel.dismiss$.subscribe(dismiss => {
      this.onDismissIntent();
    });
  }

  ngOnDestroy(): void {
    if (this.dismissSubscription) {
      this.dismissSubscription.unsubscribe();
    }
  }

  /**
   * Sets modal options.
   * @param onDismissIntent - set dismiss intent callback.
   */
  set opts({ onDismissIntent }) {
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  /**
   * Gets current step from service.
   * @returns { BehaviorSubject<OnboardingStepName> } - onboarding step name.
   */
  get currentStep$(): BehaviorSubject<OnboardingStepName> {
    return this.panel.currentStep$;
  }

  /**
   * Observable containing CSS object for banner src -
   * if none present makes height shorter.
   * @returns { Observable<object> } - css object intended for consumption by an ngStyle.
   */
  get bannerSrc$(): Observable<object> {
    return this.currentStep$.pipe(
      map((currentStep: string): object => {
        return currentStep === 'SuggestedHashtagsStep' ||
          currentStep === 'WelcomeStep'
          ? {
              backgroundImage:
                "url('../../../../assets/photos/confetti-concert-colors.jpg')",
            }
          : {
              height: '100px',
            };
      })
    );
  }

  /**
   * Observable determining whether banner should be shown.
   * @returns { Observable<boolean> } - true if banner should be shown.
   */
  get showBanner$(): Observable<boolean> {
    return this.currentStep$.pipe(
      map((currentStep: string): boolean => {
        return (
          currentStep === 'SuggestedHashtagsStep' ||
          currentStep === 'WelcomeStep'
        );
      })
    );
  }

  /**
   * Observable determining whether footer should be shown.
   * @returns { Observable<boolean> } - true if footer should be shown.
   */
  get showFooter$(): Observable<boolean> {
    return this.currentStep$.pipe(
      map((currentStep: string): boolean => {
        return (
          currentStep !== 'VerifyUniquenessStep' &&
          currentStep !== 'VerifyPhoneStep' &&
          currentStep !== 'VerifyBankStep'
        );
      })
    );
  }

  /**
   * Gets from panel service whether progress should be disabled.
   * @returns { Observable<boolean> } - true if progress should be disabled.
   */
  get disabled$(): Observable<boolean> {
    return this.panel.disableProgress$;
  }

  /**
   * Triggered on next click. Calls panel to determine next step or action.
   * @returns { Promise<void> } - awaitable.
   */
  public async nextClicked(): Promise<void> {
    try {
      this.nextClicked$.next(true);
      await this.panel.nextStep();
    } catch (e) {
      // nothing
    }
  }
}
