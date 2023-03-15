import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Central service for handling logic around the experiment
 * with the blue dot on the discovery sidenav item
 */
@Injectable({ providedIn: 'root' })
export class DiscoveryNavDotExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Whether discovery nav dot experiment is active.
   * @returns { boolean } - true if experiment is active.
   */
  public isActive(): boolean {
    return true;
    return this.experiments.hasVariation('front-5938-discovery-nav-dot', true);
  }
}
