import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether the new activity component is displayed
 */
@Injectable({ providedIn: 'root' })
export class ActivityV2ExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the activity-v2 experiment is active.
   * @returns { boolean } whether activity-v2 experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('front-5229-activities', true);
  }
}
