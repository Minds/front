import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Central service for handling logic around the discovery boost experiment.
 */
@Injectable({ providedIn: 'root' })
export class DiscoveryBoostExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Whether experiment to show boosts in discovery is active.
   * @returns { boolean } - true if experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('minds-3280-discovery-boosts', true);
  }
}
