import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelShopService } from './shop.service';
import { ChannelsV2Service } from '../channels-v2.service';
import { WireCreatorComponent } from '../../../wire/creator/creator.component';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

@Component({
  selector: 'm-channelShop__brief',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'brief.component.html',
  providers: [ChannelShopService],
})
export class ChannelShopBriefComponent {
  /**
   * Constructor
   * @param shop
   * @param channel
   * @param overlayModal
   */
  constructor(
    public shop: ChannelShopService,
    public channel: ChannelsV2Service,
    protected overlayModal: OverlayModalService
  ) {}

  /**
   * Triggers Wire modal
   * @param type
   * @param reward
   * @todo Implement Pay modal when merged
   */
  onEntryClick(type, reward) {
    this.overlayModal
      .create(WireCreatorComponent, this.channel.channel$.getValue(), {
        default: {
          min: reward.amount,
          type: type,
        },
      })
      .present();
  }
}
