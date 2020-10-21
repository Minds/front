import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StepName } from '../onboarding-v3.service';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';

@Component({
  selector: 'm-onboardingProgress',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.ng.scss'],
})
export class OnboardingV3ModalComponent {
  constructor(private panel: OnboardingV3PanelService) {}

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
          : {};
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

  get disabled$(): Observable<boolean> {
    return this.panel.disableProgress$;
  }

  public nextClicked(): void {
    this.panel.nextStep();
  }
}
