import { Component } from '@angular/core';
import {
  SettingsTwoFactorV2Service,
  TwoFactorProtectionType,
} from '../two-factor-v2.service';

/**
 * Root component - allows a user to see their currently enabled 2FA methods
 * And enable new ones.
 */
@Component({
  selector: 'm-settings__twoFactorRoot',
  template: `
    <div class="m-twoFactor__optionContainer">
      <h4 class="m-twoFactor__optionTitle">App</h4>
      <p>
        Use an application on your phone to get a two-factor authentication code
        when prompted.
      </p>
      <m-button [color]="'blue'" (onAction)="onSelect('totp')">
        <ng-container>
          Setup using an app
        </ng-container>
      </m-button>
    </div>

    <div class="m-twoFactor__optionContainer">
      <h4 class="m-twoFactor__optionTitle">SMS</h4>
      <p class="m-twoFactor__optionDescription">
        Minds will send you an SMS with a two-factor authentication code when
        prompted.
      </p>
      <m-button class="m-twoFactor__optionButton" (onAction)="onSelect('sms')">
        <ng-container>
          Setup using SMS
        </ng-container>
      </m-button>
    </div>
  `,
  styleUrls: ['./root.component.ng.scss'],
})
export class SettingsTwoFactorV2RootComponent {
  constructor(private service: SettingsTwoFactorV2Service) {}

  /**
   * Called on option select. Sets next panel and protection type.
   * @param { TwoFactorProtectionType } - totp or sms.
   * @returns { void }
   */
  public onSelect(option: TwoFactorProtectionType): void {
    this.service.selectedProtectionType$.next(option);
    this.service.activePanel$.next('password');
  }
}
