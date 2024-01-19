import { Component } from '@angular/core';
import { ConfigsService } from '../../../../../../../common/services/configs.service';

/**
 * Release section of mobile admin console.
 */
@Component({
  selector: 'm-networkAdminConsole__release',
  templateUrl: './release.component.html',
  styleUrls: [
    '././release.component.ng.scss',
    '../../stylesheets/network-admin-mobile.ng.scss',
  ],
})
export class NetworkAdminConsoleMobileReleaseComponent {
  /** URL to contact support. */
  public readonly contactSupportUrl: string;

  constructor(private configs: ConfigsService) {
    this.contactSupportUrl = `https://mindsdotcom.typeform.com/networks-vip#tenant_id=${this.configs.get(
      'tenant_id'
    )}&tenant_name=${this.configs.get('site_name')}`;
  }
}
