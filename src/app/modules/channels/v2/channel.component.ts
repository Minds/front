import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChannelsV2Service } from './channels-v2.service';
import { MindsUser } from '../../../interfaces/entities';

@Component({
  selector: 'm-channel-v2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'channel.component.html',
  providers: [ChannelsV2Service],
})
export class ChannelComponent {
  /**
   * Input that sets the current channel
   * @param channel
   * @private
   */
  @Input('channel') set _channel(channel: MindsUser) {
    this.service.load(channel);
  }

  /**
   * Constructor
   * @param service
   */
  constructor(public service: ChannelsV2Service) {}

  /**
   * Can navigate away?
   */
  canDeactivate(): boolean {
    // TODO
    return true;
  }
}
