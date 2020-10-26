import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { StepName } from '../onboarding-v3.service';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';

@Component({
  selector: 'm-onboardingProgress',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.ng.scss'],
})
export class OnboardingV3ModalComponent implements OnDestroy, OnInit {
  public nextClicked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  private dismissSubscription: Subscription;

  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = () => {};

  constructor(private panel: OnboardingV3PanelService) {}

  ngOnInit(): void {
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
   * Modal options
   *
   * @param onComplete
   * @param onDismissIntent
   * @param defaults
   */
  set opts({ onDismissIntent }) {
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  get currentStep$(): BehaviorSubject<StepName> {
    return this.panel.currentStep$;
  }

  get bannerSrc$(): Observable<object> {
    return this.currentStep$.pipe(
      map((currentStep: string): object => {
        return currentStep === 'SuggestedHashtagsStep' ||
          currentStep === 'WelcomeStep'
          ? {
              backgroundImage:
                "url('../../../../assets/photos/confetti-concert.png')",
            }
          : {
              height: '100px',
            };
      })
    );
  }

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

  get disabled$(): Observable<boolean> {
    return this.panel.disableProgress$;
  }

  public nextClicked(): void {
    this.nextClicked$.next(true);
    this.panel.nextStep();
  }
}
