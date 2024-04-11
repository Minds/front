import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Can be subscribed to to act upon success state of the MFA modal.
 */
@Injectable({ providedIn: 'root' })
export class MultiFactorAuthConfirmationService {
  // success state
  public readonly success$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Resets success state to false - should be called after acting as this service
   * is a providedIn root singleton, and may not be destroyed after use.
   * @returns { MultiFactorAuthConfirmationService } - instance of this.
   */
  public reset(): MultiFactorAuthConfirmationService {
    this.success$.next(false);
    return this;
  }
}
