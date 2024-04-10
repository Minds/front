import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Twitter Sync Settings experiment wrapper. On state should show the option for
 * Twitter Sync in a users settings. Note in addition to this there is a router guard
 * on the settings route that does NOT use the service.
 */
@Injectable({ providedIn: 'root' })
export class TwitterSyncSettingsExperimentService {
  private readonly experimentId: string = 'front-6032-twitter-sync-settings';

  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the experiment is active.
   * @returns { boolean } whether experiment is active.
   */
  public isActive(): boolean {
    // return this.experiments.hasVariation(this.experimentId, true);
    return true;
  }
}
