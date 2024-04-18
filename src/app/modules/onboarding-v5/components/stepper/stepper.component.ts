import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OnboardingV5Service } from '../../services/onboarding-v5.service';
import { OnboardingStep } from '../../types/onboarding-v5.types';

/**
 * Stepper component that relays completion progress at the top of the modal.
 * [ o-o-o-o-o ]
 */
@Component({
  selector: 'm-onboardingV5__stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['stepper.component.ng.scss'],
})
export class OnboardingV5StepperComponent {
  /** Steps. */
  public readonly steps$: Observable<OnboardingStep[]> = this.service.steps$;

  /** Active step. */
  public readonly activeStep$: Observable<OnboardingStep> =
    this.service.activeStep$;

  constructor(private service: OnboardingV5Service) {}
}
