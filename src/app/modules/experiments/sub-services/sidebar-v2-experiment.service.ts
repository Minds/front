import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether front-5924-sidebar-v2 experiment is active, based upon whether
 * the feature flag is enabled.
 */
@Injectable({ providedIn: 'root' })
export class SidebarV2ExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the front-5924-sidebar-v2 experiment is active.
   * @returns { boolean } whether sidebar experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('front-5924-sidebar-v2', true);
  }
}
