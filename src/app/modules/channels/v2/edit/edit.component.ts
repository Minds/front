import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FeaturesService } from '../../../../services/features.service';
import { MindsUser } from '../../../../interfaces/entities';
import { ChannelEditService } from './edit.service';

@Component({
  selector: 'm-channel__edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'edit.component.html',
  providers: [ChannelEditService],
})
export class ChannelEditComponent {
  /**
   * Sets the channel to be edited
   * @param channel
   */
  @Input('channel') set data(channel: MindsUser) {
    this.service.setChannel(channel);
  }

  /**
   * Constructor
   * @param service
   * @param features
   */
  constructor(
    public service: ChannelEditService,
    protected features: FeaturesService
  ) {}

  /**
   * Gets Pro settings URL
   * @param channel
   */
  getProSettingsRouterLink(channel: MindsUser) {
    if (!channel) {
      return [];
    }

    if (!this.features.has('navigation')) {
      return ['/pro', channel.username, 'settings'];
    }

    return ['/settings/canary/pro_canary', channel.username];
  }
}
