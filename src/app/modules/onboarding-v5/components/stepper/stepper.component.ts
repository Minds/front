import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OnboardingV5Service } from '../../services/onboarding-v5.service';
import { OnboardingStep } from '../../types/onboarding-v5.types';

@Component({
  selector: 'm-onboardingV5__stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['stepper.component.ng.scss'],
})
export class OnboardingV5StepperComponent {
  public readonly steps$: Observable<OnboardingStep[]> = this.service.steps$;
  public readonly activeStep$: Observable<OnboardingStep> = this.service
    .activeStep$;

  constructor(private service: OnboardingV5Service) {}
}
