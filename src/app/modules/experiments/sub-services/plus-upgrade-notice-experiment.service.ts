import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Plus upgrade experiment service. Handles getting the assigned variation for
 * a quinary experiment that controls the text seen in the plus upgrade notice.
 */
@Injectable({ providedIn: 'root' })
export class PlusUpgradeNoticeExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Gets active variation assigned to the user.
   * @returns { number } active variation. Defaults to 0.
   */
  public getActiveVariation(): number {
    // return parseInt(
    //   this.experiments.run('minds-3639-plus-notice')?.toString() ?? '0'
    // );
    return 0;
  }
}
