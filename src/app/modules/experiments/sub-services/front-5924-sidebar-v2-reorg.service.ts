import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Service for the front-5924-sidebar-v2-reorg experiment. This is a ternary experiment
 * where-in it is configured such that:
 * - Variation 0: Sidebar V1
 * - Variation 1: Sidebar V2 WITHOUT reorganization specified in minds#3997
 * - Variation 2: Sidebar V2 WITH reorganization specified in minds#3997
 */
@Injectable({ providedIn: 'root' })
export class SidebarV2ReorgExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Gets currently active variation.
   * @returns { number } currently active variation.
   */
  public getActiveVariation(): number {
    return parseInt(this.experiments.run('front-5924-sidebar-v2-reorg') ?? '0');
  }

  /**
   * Whether a sidebar V2 variation is active (variation 1 or 2).
   * @returns { boolean } true if a sidebar v2 variant is active.
   */
  public isSidebarV2VariationActive(): boolean {
    const activeVariation = this.getActiveVariation();
    return activeVariation === 1 || activeVariation === 2;
  }

  /**
   * Whether sidebar v2 reorganisation variation is active (variation 2).
   * @returns { boolean } true if sidebar v2 reorganisation variation is active.
   */
  public isReorgVariationActive(): boolean {
    return this.getActiveVariation() === 2;
  }
}
