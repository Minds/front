import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Central service for handling logic around the boost audience platform targeting feature
 */
@Injectable({ providedIn: 'root' })
export class BoostTargetExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Whether experiment is active.
   * @returns { boolean } - true if experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation(
      'minds-4030-boost-platform-targeting',
      true
    );
  }
}
