import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether dynamic boost pricing experiment is active ('epic-293-dynamic-boost'), based
 * upon whether the user has been assigned the experimental variant / the feature
 * flag is enabled.
 */
@Injectable({ providedIn: 'root' })
export class DynamicBoostExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the experiment is active.
   * @returns { boolean } whether experiment is active.
   */
  public isActive(): boolean {
    // ojm temp
    return true;
    // return this.experiments.hasVariation('epic-293-dynamic-boost', true);
  }
}
