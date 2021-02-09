import { Component } from '@angular/core';
import { OnboardingStepName } from '../../onboarding-v3.service';
import { OnboardingV3PanelService } from '../onboarding-panel.service';

/**
 * Parent panel linking the user to uniqueness verification methods.
 */
@Component({
  selector: 'm-onboardingV3__verifyUniqueness',
  templateUrl: './verify-uniqueness.component.html',
  styleUrls: ['./verify-uniqueness.component.ng.scss'],
})
export class OnboardingV3VerifyUniquenessComponent {
  constructor(private panel: OnboardingV3PanelService) {}

  /**
   * On option selected.
   * @param { OnboardingStepName } - option clicked.
   * @returns { void }
   */
  public optionClicked(option: OnboardingStepName): void {
    this.panel.currentStep$.next(option);
  }
}
