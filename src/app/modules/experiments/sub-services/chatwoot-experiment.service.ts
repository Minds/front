import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether Chatwoot experiment is active, based upon whether
 * the feature flag is enabled.
 */
@Injectable({ providedIn: 'root' })
export class ChatwootExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the Chatwoot experiment is active.
   * @returns { boolean } whether Chatwoot experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('minds-3897-chatwoot', true);
  }
}
