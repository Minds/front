import { Component } from '@angular/core';
import { ChatwootWidgetService } from '../../../../../../../common/components/chatwoot-widget/chatwoot-widget.service';

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
  constructor(private chatwootWidgetService: ChatwootWidgetService) {}

  /**
   * Toggle chatwoot window on contact support button click.
   * @returns { void }
   */
  public onContactSupportClick(): void {
    this.chatwootWidgetService.toggleChatWindow();
  }
}
