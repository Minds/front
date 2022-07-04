import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FormToastService } from '../../../../../../common/services/form-toast.service';
import { SettingsTwoFactorV2Service } from '../../two-factor-v2.service';

/**
 * Disable confirmation button for SMS 2FA.
 * NOTE: SMS 2FA is deprecated, this component is only shown to users who already have SMS enabled.
 **/
@Component({
  selector: 'm-twoFactor__confirmDisable--sms',
  template: `
    <span
      *ngIf="disableMode$ | async"
      class="m-twoFactorDisable__text"
      i18n="@@2FA_PASSWORD__ARE_YOU_SURE"
      >Are you sure you want to disable two-factor authentication?</span
    >
    <m-settings--two-factor
      (saved)="onSave()"
      (disabled)="onDisable()"
    ></m-settings--two-factor>
  `,
  styleUrls: ['../confirm-disable.component.ng.scss'],
})
export class SettingsTwoFactorDisableSMSComponent {
  constructor(
    private service: SettingsTwoFactorV2Service,
    private toast: FormToastService
  ) {}

  /**
   * True if SMS is currently enabled - meaning the action being taken is disable.
   * @returns { Observable<boolean> } - true if user is to be disabling.
   */
  get disableMode$(): Observable<boolean> {
    return this.service.smsEnabled$;
  }

  /**
   * Called on save event emitted from m-settings--two-factor.
   * @returns { void }
   */
  public onSave(): void {
    this.toast.success('Successfully set up SMS MFA');
    this.service.reloadSettings(); // async
    this.service.activePanel$.next({ panel: 'root', intent: 'enabled-sms' });
  }

  /**
   * Called on disable event emitted from m-settings--two-factor.
   * @returns { void }
   */
  public onDisable(): void {
    this.toast.success('Successfully disabled SMS MFA');
    this.service.reloadSettings(); // async
    this.service.activePanel$.next({ panel: 'root', intent: 'disabled-sms' });
  }
}
