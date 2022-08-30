import { Component, Input, OnInit } from '@angular/core';
import { MindsUser } from '../../../../interfaces/entities';
import { ChannelsV2Service } from '../../../channels/v2/channels-v2.service';

/**
 * The meatball menu in the pro channel footer.
 * Visible for non-owners.
 * (Menu is imported from channelsV2 module)
 */
@Component({
  selector: 'm-pro__footerMenuButton',
  templateUrl: './footer-menu-button.component.html',
  styleUrls: ['./footer-menu-button.component.ng.scss'],
})
export class ProChannelFooterMenuButtonComponent {
  constructor(public channelsV2Service: ChannelsV2Service) {}

  /**
   * Input that sets the current channel
   * @param channel
   * @private
   */
  @Input('channel') set _channel(channel: MindsUser) {
    this.channelsV2Service.load(channel);
  }
}
