import { Component } from '@angular/core';
import { take, throttleTime } from 'rxjs/operators';
import { MultiFactorAuthService } from '../../services/multi-factor-auth-service';
import { AbstractMFAFormComponent } from '../abstract/abstract-mfa-form.component';

/**
 * MFA input form for TOTP recovery.
 */
@Component({
  selector: 'm-multiFactorAuth__totpRecovery',
  templateUrl: './recovery-code.component.html',
  styleUrls: ['../mfa-panel.component.ng.scss'],
})
export class MultiFactorAuthTOTPRecoveryComponent extends AbstractMFAFormComponent {
  constructor(public service: MultiFactorAuthService) {
    super(service);
  }

  /**
   * On verify clicked.
   * @returns { void }
   */
  public onVerifyClick(): void {
    this.subscriptions.push(
      this.code$.pipe(take(1), throttleTime(1000)).subscribe((code: string) => {
        this.service.validateRecoveryCode(code);
      })
    );
  }
}
