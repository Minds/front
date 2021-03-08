import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import {
  SettingsTwoFactorV2Service,
  TwoFactorSetupPanel,
} from '../two-factor-v2.service';

/**
 * Disable confirmation button for 2fa.
 **/
@Component({
  selector: 'm-twoFactor__confirmDisable',
  template: `
    <span class="m-twoFactorDisable__text" i18n="@@2FA_PASSWORD__ARE_YOU_SURE"
      >Are you sure you want to disable two-factor authentication?</span
    >
    <m-button
      [color]="'red'"
      (onAction)="disable()"
      [disabled]="inProgress$ | async"
    >
      <ng-container i18n="disable 2fa|@@2FA_PASSWORD__DISABLE_APP_INTEGRATION">
        Disable app integration
      </ng-container>
    </m-button>
  `,
  styleUrls: ['./confirm-disable.component.ng.scss'],
})
export class SettingsTwoFactorDisableComponent {
  // is in progress
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Currently active panel,
   * @returns { BehaviorSubject<TwoFactorSetupPanel> } current panel from service
   */
  get activePanel$(): BehaviorSubject<TwoFactorSetupPanel> {
    return this.service.activePanel$;
  }

  constructor(
    private service: SettingsTwoFactorV2Service,
    private toast: FormToastService
  ) {}

  /**
   * On disable click
   * @returns { void }
   */
  public disable(): void {
    try {
      this.inProgress$.next(true);
      this.service.disable2fa();
    } catch (e) {
      this.toast.error('Sorry, an unknown error has occurred disabling 2FA.');
      this.inProgress$.next(false);
    }
  }
}
