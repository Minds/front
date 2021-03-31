import { Component } from '@angular/core';

/**
 * Code popup - display secret for user.
 */
@Component({
  selector: 'm-twoFactor__codePopup',
  template: `
    <span
      class="m-twoFactorSecret__title"
      i18n="@@2FA_SETUP__YOUR_MANUAL_ACTIVATION_CODE"
      >Your two-factor secret</span
    >
    <span class="m-twoFactorSecret__code">{{ code }}</span>
  `,
  styleUrls: ['./code-popup.component.ng.scss'],
})
export class SettingsTwoFactorCodePopupComponent {
  public code: string = '';

  set opts({ code }) {
    this.code = code || '';
  }
}
