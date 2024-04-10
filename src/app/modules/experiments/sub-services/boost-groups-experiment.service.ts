import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Central service for handling logic around the group boosting feature.
 */
@Injectable({ providedIn: 'root' })
export class BoostGroupExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Whether experiment is active.
   * @returns { boolean } - true if experiment is active.
   */
  public isActive(): boolean {
    // return this.experiments.hasVariation('minds-4159-boost-groups', true);
    return true;
  }
}
