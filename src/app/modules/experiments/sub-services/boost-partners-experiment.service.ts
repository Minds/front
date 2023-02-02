import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Central service for handling logic around the boost partners experiment.
 */
@Injectable({ providedIn: 'root' })
export class BoostPartnersExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Whether boost partners experiment is active.
   * @returns { boolean } - true if experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('epic-303-boost-partners', true);
  }
}
