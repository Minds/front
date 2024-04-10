import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether guest mode experiment is active, based upon whether
 * the user has been assigned the experimental variant the feature flag is enabled.
 */
@Injectable({ providedIn: 'root' })
export class GuestModeExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the guest mode experiment is active.
   * @returns { boolean } whether guest mode experiment is active.
   */
  public isActive(): boolean {
    //return this.experiments.hasVariation('discovery-homepage', true);
    return false;
  }
}
