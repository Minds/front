import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Video.js experiment wrapper. Controls site-wide use of video.js instead
 * of Plyr. Livestreams will use Video.js regardless of this experiment.
 */
@Injectable({ providedIn: 'root' })
export class VideoJsExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the front-5408-videojs experiment is active.
   * @returns { boolean } whether default front-5408-videojs experiment is active.
   */
  public isActive(): boolean {
    // return this.experiments.hasVariation('front-5408-videojs', true);
    return false;
  }
}
