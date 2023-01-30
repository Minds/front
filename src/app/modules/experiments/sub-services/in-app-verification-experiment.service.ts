import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether dynamic boost pricing experiment is active ('epic-293-dynamic-boost'), based
 * upon whether the user has been assigned the experimental variant / the feature
 * flag is enabled.
 */
@Injectable({ providedIn: 'root' })
export class InAppVerificationExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the experiment is active.
   * @returns { boolean } whether experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('epic-275-in-app-verification', true);
  }
}
