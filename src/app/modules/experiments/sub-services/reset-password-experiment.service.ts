import { Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';

/**
 * Central service for handling logic around using the
 * new password reset modals
 */
@Injectable({ providedIn: 'root' })
export class ResetPasswordExperimentService {
  constructor(private experiments: ExperimentsService) {}

  /**
   * Whether experiment is active.
   * @returns { boolean } - true if experiment is active.
   */
  public isActive(): boolean {
    //ojm remove
    return true;
    return this.experiments.hasVariation('front-5986-reset-password', true);
  }
}
