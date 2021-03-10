import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormToastService } from '../../../../common/services/form-toast.service';

/**
 * Modal entry-points.
 */
export type MultiFactorRootPanel = 'sms' | 'totp';

/**
 * Different panels that can be displayed.
 */
export type MultiFactorPanel =
  | MultiFactorRootPanel
  | 'totp-code'
  | 'totp-recovery'
  | '';

/**
 * Service for Multi-factor authentication.
 * Handles shared state.
 */
@Injectable({ providedIn: 'root' })
export class MultiFactorAuthService {
  /**
   * Currently active panel.
   */
  public readonly activePanel$: BehaviorSubject<
    MultiFactorPanel
  > = new BehaviorSubject<MultiFactorPanel>('totp');

  /**
   * Code from form.
   */
  public readonly code$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  constructor(private toast: FormToastService) {}

  /**
   * Call to validate code.
   * TODO: Implement
   * @param { string } code - code for submission.
   * @returns { void }
   */
  public validateCode(code: string): void {
    this.toast.error('Validate code not yet implemented! Code: ' + code);
  }

  /**
   * Call to validate code.
   * TODO: Implement
   * @param { string } code - code for submission.
   * @returns { void }
   */
  public validateRecoveryCode(code: string): void {
    this.toast.error(
      'Validate recovery code not yet implemented! Code: ' + code
    );
  }

  /**
   * Call to validate code.
   * TODO: Implement
   * @param { string } code - code for submission.
   * @returns { void }
   */
  public validateSMSCode(code: string): void {
    this.toast.error('Validate SMS code not yet implemented! Code: ' + code);
  }
}
