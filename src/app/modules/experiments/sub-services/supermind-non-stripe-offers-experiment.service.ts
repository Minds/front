import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Central service for determining whether supermind feature is active.
 */
@Injectable({ providedIn: 'root' })
export class SupermindNonStripeOffersExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Check if feature is active.
   * @returns { boolean } true if feature is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation(
      'minds-3488-supermind-non-stripe-recipients-handling',
      true
    );
  }
}
