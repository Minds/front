import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import {
  SettingsTwoFactorV2Service,
  TwoFactorSetupPanel,
} from '../../two-factor-v2.service';

/**
 * Disable confirmation button for TOTP 2FA.
 **/
@Component({
  selector: 'm-twoFactor__confirmDisable--totp',
  template: `
    <span class="m-twoFactorDisable__text" i18n="@@2FA_PASSWORD__ARE_YOU_SURE"
      >Are you sure you want to disable two-factor authentication?</span
    >
    <input
      class="m-twoFactor__confirmDisableInput"
      type="text"
      [ngModel]="code$ | async"
      (ngModelChange)="codeValueChanged($event)"
      placeholder="Enter code"
    />
    <m-button
      [color]="'red'"
      (onAction)="disable()"
      [saving]="inProgress$ | async"
      [disabled]="disabled$ | async"
    >
      <ng-container i18n="disable 2fa|@@2FA_PASSWORD__DISABLE_APP_INTEGRATION">
        Disable app integration
      </ng-container>
    </m-button>
  `,
  styleUrls: ['../confirm-disable.component.ng.scss'],
})
export class SettingsTwoFactorDisableTOTPComponent {
  /**
   * Code for disable confirmation.
   */
  public readonly code$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  /**
   * Disable progress if the length of the user inputted code is not 6.
   * @returns { Observable<boolean> } - true if progress should be blocked.
   */
  get disabled$(): Observable<boolean> {
    return this.code$.pipe(
      map((code: string) => {
        return code.length !== 6;
      })
    );
  }

  /**
   * Is in progress from service.
   * @returns { BehaviorSubject<boolean> } - true if in progress.
   */
  get inProgress$(): BehaviorSubject<boolean> {
    return this.service.inProgress$;
  }

  /**
   * Currently active panel,
   * @returns { BehaviorSubject<TwoFactorSetupPanel> } current panel from service
   */
  get activePanel$(): BehaviorSubject<TwoFactorSetupPanel> {
    return this.service.activePanel$;
  }

  constructor(
    private service: SettingsTwoFactorV2Service,
    private toast: ToasterService
  ) {}

  /**
   * On disable click
   * @returns { void }
   */
  public disable(): void {
    try {
      this.service.removeTotp(this.code$.getValue());
    } catch (e) {
      this.toast.error('Sorry, an unknown error has occurred disabling 2FA.');
    }
  }

  /**
   * Called on code value change
   * @param { string } $event - new code.
   * @returns { void }
   */
  public codeValueChanged($event): void {
    this.code$.next($event);
  }
}
