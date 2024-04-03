import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether the persistent feed experiment is active
 * Not flag currently
 */
@Injectable({ providedIn: 'root' })
export class PersistentFeedExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the experiment is active
   * @returns { boolean } whether the experiment is active
   */
  public isActive(): boolean {
    return false;
  }
}
