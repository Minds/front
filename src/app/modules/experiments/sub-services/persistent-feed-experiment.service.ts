import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether the persistent feed experiment is active
 * https://growthbook.minds.com/features/front-5333-persistent-feed
 */
@Injectable({ providedIn: 'root' })
export class PersistentFeedExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the experiment is active
   * @returns { boolean } whether the experiment is active
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('front-5333-persistent-feed', true);
  }
}
