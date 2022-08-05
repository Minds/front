import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Default tags v2 experiment wrapper.
 */
@Injectable({ providedIn: 'root' })
export class DefaultTagsV2ExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Returns true if the default tags v2 experiment is active.
   * @returns { boolean } whether default tags v2 experiment is active.
   */
  public isActive(): boolean {
    return this.experiments.hasVariation('minds-3216-default-tags-v2', true);
  }
}
