import { Injectable } from '@angular/core';
import { FeaturesService } from '../../../services/features.service';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether top feed experiment is active, based upon whether
 * the user has been assigned the experimental variant the feature flag is enabled.
 */
@Injectable({ providedIn: 'root' })
export class TopFeedExperimentService {
  constructor(
    private featuresService: FeaturesService,
    private experiments: ExperimentsService
  ) {}

  /**
   * Returns true if the top feed experiment is active.
   * @returns { boolean } whether top feed experiment is active.
   */
  public isActive(): boolean {
    return true;
    return (
      this.featuresService.has('top-feed') &&
      this.experiments.hasVariation('top-feed-2', 'on')
    );
  }
}
