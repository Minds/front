import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Returns whether experiment is active for entity metric sockets, providing live updates
 * to upvotes and downvotes.
 */
@Injectable({ providedIn: 'root' })
export class EntityMetricsSocketsExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the engine-1218-metrics-sockets experiment is active.
   * @returns { boolean } whether engine-1218-metrics-sockets experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('engine-1218-metrics-sockets', true);
  }
}
