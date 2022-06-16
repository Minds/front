import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether the 'Minds Festival of Ideas' experiment
 * is enabled. It should be enabled for all users up until and
 * no later than the time event doors open in NYC
 */
@Injectable({ providedIn: 'root' })
export class FestivalBannerExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the festival banner experiment is active.
   * @returns { boolean }
   */
  public isActive(): boolean {
    return (
      this.experiments.hasVariation('front-5575-festival-banner', true) &&
      this.eventHasNotStarted()
    );
  }

  /**
   * Returns true if the festival already started
   */
  eventHasNotStarted(): boolean {
    // Jun 25 2022 7pm EDT (NYC time)
    const eventStartTime = 1656198000000;

    return Date.now() < eventStartTime;
  }
}
