import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Service for Onboarding V5 experiment. Holds 2 feature flags:
 *
 * 1. Enrollment experiment - whether user is assigned into Onboarding V5 enrollment.
 * This should be checked on registration to get the users assigned bucket, such that
 * if they clear their storage or switch devices, we don't risk reallocating them into
 * a different onboarding flow.
 *
 * 2. Global on switch experiment - whether OnboardingV5 is globally active. If switching off
 * the modal should not be shown.
 */
@Injectable({ providedIn: 'root' })
export class OnboardingV5ExperimentService {
  // Feature flag names.
  private readonly ENROLLMENT_EXPERIMENT_ID: string =
    'minds-4096-onboarding-v5-enrollment';
  private readonly GLOBAL_ON_SWITCH_EXPERIMENT_ID: string =
    'minds-4096-onboarding-v5-global-on-switch';

  constructor(private experiments: ExperimentsService) {}

  /**
   * Check if user is assigned into Onboarding V5 enrollment.
   * @returns { boolean } whether user is assigned into Onboarding V5 enrollment.
   */
  public isEnrollmentActive(): boolean {
    return this.experiments.hasVariation(this.ENROLLMENT_EXPERIMENT_ID, true);
  }

  /**
   * Check is OnboardingV5 is active.
   * @returns { boolean } whether OnboardingV5 is active.
   */
  public isGlobalOnSwitchActive(): boolean {
    return this.experiments.hasVariation(
      this.GLOBAL_ON_SWITCH_EXPERIMENT_ID,
      true
    );
  }
}
