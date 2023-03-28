import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether user menu boost experiment is active ('minds-3853-user-menu-boost'),
 * based upon whether the user has been assigned the experimental variant / the feature
 * flag is enabled.
 */
@Injectable({ providedIn: 'root' })
export class UserMenuBoostExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the experiment is active.
   * @returns { boolean } whether experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('minds-3853-user-menu-boost', true);
  }
}
