import { Component } from '@angular/core';
import { take, throttleTime } from 'rxjs/operators';
import { MultiFactorAuthService } from '../../services/multi-factor-auth-service';
import { AbstractMFAFormComponent } from '../abstract/abstract-mfa-form.component';

/**
 * MFA input form for TOTP.
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
    this.subscriptions.push(
      this.code$.pipe(take(1), throttleTime(1000)).subscribe((code: string) => {
        this.service.validateCode(code);
      })
    );
  }

  /**
   * On user request for recovery code.
   * @returns { void }
   */
  public onRecoveryCodeClick(): void {
    this.activePanel$.next('totp-recovery');
  }
}
