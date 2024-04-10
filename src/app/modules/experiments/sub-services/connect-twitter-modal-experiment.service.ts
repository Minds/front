import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Central service for determining whether connect twitter modal feature is active.
 */
@Injectable({ providedIn: 'root' })
export class ConnectTwitterModalExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Check if feature is active.
   * @returns { boolean } true if feature is active.
   */
  public isActive(): boolean {
    // return this.experiments.hasVariation(
    //   'minds-3477-connect-twitter-modal',
    //   true
    // );
    return true;
  }
}
