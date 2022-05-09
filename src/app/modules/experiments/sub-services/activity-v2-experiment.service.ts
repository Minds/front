import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether guest mode experiment is active, based upon whether
 * the user has been assigned the experimental variant the feature flag is enabled.
 */
@Injectable({ providedIn: 'root' })
export class ActivityV2ExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the guest mode experiment is active.
   * @returns { boolean } whether guest mode experiment is active.
   */
  public isActive(): boolean {
    return true;
    // ojm uncomment !!!
    // return this.experiments.hasVariation('front-5229-activities', true);
  }
}
