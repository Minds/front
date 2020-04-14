import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';

/**
 * Extra actions dropdown menu
 */
@Component({
  selector: 'm-channelActions__menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'menu.component.html',
})
export class ChannelActionsMenuComponent {
  /**
   * Constructor
   * @param service
   */
  constructor(public service: ChannelsV2Service) {}
}
