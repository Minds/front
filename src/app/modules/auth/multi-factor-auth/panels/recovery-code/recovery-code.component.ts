import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, throttleTime } from 'rxjs/operators';
import { MultiFactorAuthService } from '../../services/multi-factor-auth-service';
import { AbstractMFAFormComponent } from '../abstract/abstract-mfa-form.component';

/**
 * MFA input form for TOTP recovery.
 * User enters recovery code in case of lost access to mobile device
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
    this.service.validateRecoveryCode(this.code);
  }
}
