import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Chat experiment wrapper. Controls site-wide release of chats feature
 */
@Injectable({ providedIn: 'root' })
export class ChatExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the epic-358-chat experiment is active.
   * @returns { boolean } whether default epic-358-chat experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('epic-358-chat', true);
  }
}
