import { Component } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { scan, take, takeWhile, throttleTime } from 'rxjs/operators';
import {
  MultiFactorAuthService,
  MultiFactorPanel,
} from '../../services/multi-factor-auth-service';
import { AbstractMFAFormComponent } from '../abstract/abstract-mfa-form.component';

/**
 * MFA input form for SMS.
 */
@Component({
  selector: 'm-multiFactorAuth__sms',
  templateUrl: './sms.component.html',
  styleUrls: ['../mfa-panel.component.ng.scss'],
})
export class MultiFactorAuthSMSComponent extends AbstractMFAFormComponent {
  /**
   * Holds timer for SMS resend.
   */
  public timer$: Observable<number>;

  constructor(public service: MultiFactorAuthService) {
    super(service);
  }

  /**
   * Active panel from service.
   * @returns { BehaviorSubject<MultiFactorPanel> } - currently active panel.
   */
  get activePanel$(): BehaviorSubject<MultiFactorPanel> {
    return this.service.activePanel$;
  }

  /**
   * On verify clicked.
   * @returns { void }
   */
  public onVerifyClick(): void {
    this.subscriptions.push(
      this.code$.pipe(take(1), throttleTime(1000)).subscribe((code: string) => {
        this.service.validateSMSCode(code);
      })
    );
  }

  /**
   * Resends SMS and starts timer counting down from 30 seconds.
   * @returns { void }
   */
  public resendSMSTimer(): void {
    this.service.resendSMS();

    this.timer$ = timer(0, 1000).pipe(
      scan(acc => --acc, 30),
      takeWhile(x => x >= 0)
    );
  }
}
