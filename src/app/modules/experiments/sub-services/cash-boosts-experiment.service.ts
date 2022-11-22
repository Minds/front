import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether cash boosts experiment is active ('engine-2462-cash-boosts').
 */
@Injectable({ providedIn: 'root' })
export class CashBoostsExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the experiment is active.
   * @returns { boolean } whether experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('engine-2462-cash-boosts', true);
  }
}
