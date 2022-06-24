import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether onboarding feed-notices experiment is active, based upon whether
 * the user has been assigned the experimental variant / the feature flag is enabled.
 */
@Injectable({ providedIn: 'root' })
export class OnboardingFeedNoticesExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the onboarding feed-notices experiment is active.
   * @returns { boolean } whether onboarding feed-notices experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('minds-3131-onboarding-notices', true);
  }
}
