import { Component } from '@angular/core';
import { CustomPageType } from '../../../../../custom-pages/custom-pages.types';
/**
 * Network admin console community guidelines subsection.
 * Allows a user to configure the community guidelines for a network.
 */
@Component({
  selector: 'm-networkAdminConsole__communityGuidelines',
  templateUrl: './community-guidelines.component.html',
  styleUrls: ['../../../stylesheets/console.component.ng.scss'],
})
export class NetworkAdminConsoleCommunityGuidelinesComponent {
  /**
   * Allows us to use enum in the template
   */
  public CustomPageType: typeof CustomPageType = CustomPageType;
}
