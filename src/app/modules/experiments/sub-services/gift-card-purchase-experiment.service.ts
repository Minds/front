import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Controls whether gift card purchase feature is active.
 */
@Injectable({ providedIn: 'root' })
export class GiftCardPurchaseExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the minds-4302-gift-card-purchase feature is active.
   * @returns { boolean } whether minds-4302-gift-card-purchase feature is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('minds-4302-gift-card-purchase', true);
  }
}
