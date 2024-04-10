import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Central service for handling logic around the experiment.
 */
@Injectable({ providedIn: 'root' })
export class GiftCardClaimExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Whether experiment is active.
   * @returns { boolean } - true if experiment is active.
   */
  public isActive(): boolean {
    // return this.experiments.hasVariation('minds-4126-gift-card-claim', true);
    return true;
  }
}
