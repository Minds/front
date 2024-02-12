import { Component } from '@angular/core';
import { CustomPageType } from '../../../../../custom-pages/custom-pages.types';
/**
 * Allows a user to configure the terms of service for a network.
 */
@Component({
  selector: 'm-networkAdminConsole__termsOfService',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['../../../stylesheets/console.component.ng.scss'],
})
export class NetworkAdminConsoleTermsOfServiceComponent {
  /**
   * Allows us to use enum in the template
   */
  public CustomPageType: typeof CustomPageType = CustomPageType;
}
