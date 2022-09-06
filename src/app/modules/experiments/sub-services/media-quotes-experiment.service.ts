import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * https://growthbook.minds.com/features/front-5645-media-quotes
 */
@Injectable({ providedIn: 'root' })
export class MediaQuotesExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the media quotes experiment is active.
   * @returns { boolean } whether media quotes experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('front-5645-media-quotes', true);
  }
}
