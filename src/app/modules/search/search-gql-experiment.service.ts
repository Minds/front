import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments/experiments.service';

/**
 * Central service for handling logic around the experiment.
 */
@Injectable({ providedIn: 'root' })
export class SearchGqlExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Whether experiment is active.
   * @returns { boolean } - true if experiment is active.
   */
  public isActive(): boolean {
    // return this.experiments.hasVariation('minds-4127-search', true);
    return true;
  }
}
