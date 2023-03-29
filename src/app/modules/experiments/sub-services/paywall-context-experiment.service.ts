import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Central service for handling logic around the paywall context experiment
 */
@Injectable({ providedIn: 'root' })
export class PaywallContextExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Whether the experiment is active.
   * @returns { boolean } - true if experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('minds-3857-paywall-context', true);
  }
}
