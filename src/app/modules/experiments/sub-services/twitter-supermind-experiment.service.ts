import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Service for managing the Twitter Supermind feature - allowing the creation
 * of Supermind that require a recipient to also cross-post their response to
 * Twitter.
 */
@Injectable({ providedIn: 'root' })
export class TwitterSupermindExperimentService {
  private readonly experimentId: string = 'engine-2526-twitter-superminds';

  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the experiment is active.
   * @returns { boolean } whether experiment is active.
   */
  public isActive(): boolean {
    //return this.experiments.hasVariation(this.experimentId, true);
    return false;
  }
}
