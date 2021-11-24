import { Inject } from '@angular/core';
import { FeaturesService } from '../../../services/features.service';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether guest mode experiment is active, based upon whether
 * the user has been assigned the experimental variant the feature flag is enabled.
 */
@Inject({ providedIn: 'root' })
export class GuestModeExperimentService {
  constructor(
    private featuresService: FeaturesService,
    private experiments: ExperimentsService
  ) {}

  /**
   * Returns true if the guest mode experiment is active.
   * @returns { boolean } whether guest mode experiment is active.
   */
  public isActive(): boolean {
    return (
      this.featuresService.has('guest-mode') &&
      this.experiments.hasVariation('discovery-homepage', 'on')
    );
  }
}
