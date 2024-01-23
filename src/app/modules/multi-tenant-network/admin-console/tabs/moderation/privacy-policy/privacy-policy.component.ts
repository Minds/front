import { Component } from '@angular/core';
import { CustomPageType } from '../../../../../custom-pages/custom-pages.types';
/**
 * Allows a user to configure the privacy policy for a network.
 */
@Component({
  selector: 'm-networkAdminConsole__privacyPolicy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['../../../stylesheets/console.component.ng.scss'],
})
export class NetworkAdminConsolePrivacyPolicyComponent {
  /**
   * Allows us to use enum in the template
   */
  public CustomPageType: typeof CustomPageType = CustomPageType;
}
