import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';

/**
 * Subscribe button (non-owner)
 */
@Component({
  selector: 'm-channelActions__subscribe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'subscribe.component.html',
})
export class ChannelActionsSubscribeComponent {
  constructor(public service: ChannelsV2Service) {}
  subscribe(): void {}
}
