import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Newsfeed for you tab experiment wrapper. Controls showing of the 'for you' option
 * in the newsfeed top tab bar.
 */
@Injectable({ providedIn: 'root' })
export class NewsfeedForYouExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the minds-3953-newsfeed-for-you experiment is active.
   * @returns { boolean } whether minds-3953-newsfeed-for-you experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('minds-3953-newsfeed-for-you', true);
  }
}
