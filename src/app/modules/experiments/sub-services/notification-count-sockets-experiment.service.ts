import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Experiment wrapper for engine-2592-notification-count-sockets. When enabled,
 * notification count updates will come through sockets rather than being
 * retrieved through polling.
 */
@Injectable({ providedIn: 'root' })
export class NotificationCountSocketsExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the experiment is active.
   * @returns { boolean } whether experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation(
      'engine-2592-notification-count-sockets',
      true
    );
  }
}
