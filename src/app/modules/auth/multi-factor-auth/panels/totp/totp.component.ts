import { Component } from '@angular/core';
import { take, throttleTime } from 'rxjs/operators';
import { MultiFactorAuthService } from '../../services/multi-factor-auth-service';
import { AbstractMFAFormComponent } from '../abstract/abstract-mfa-form.component';

/**
 * MFA (multi-factor authentication) input form
 * for TOTP (time-based one-time password)
 */
@Component({
  selector: 'm-multiFactorAuth__totp',
  templateUrl: './totp.component.html',
  styleUrls: ['../mfa-panel.component.ng.scss'],
})
export class MultiFactorAuthTOTPComponent extends AbstractMFAFormComponent {
  constructor(public service: MultiFactorAuthService) {
    super(service);
  }

  /**
   * On verify clicked.
   * @returns { void }
   */
  public onVerifyClick(): void {
    this.service.completeMultiFactor(this.code);
  }

  /**
   * On user request for recovery code.
   * @returns { void }
   */
  public onRecoveryCodeClick(): void {
    this.activePanel$.next('totp-recovery');
  }
}
