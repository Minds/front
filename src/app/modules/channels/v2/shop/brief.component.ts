import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { WireModalService } from '../../../wire/wire-modal.service';
import {
  SupportTier,
  SupportTiersService,
} from '../../../wire/v2/support-tiers.service';
import { Subscription } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';

/**
 * List of available channel membership tiers,
 * displayed on the right sidebar of channel feed page in wider screens
 */
@Component({
  selector: 'm-channelShop__brief',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'brief.component.html',
  styleUrls: ['brief.component.ng.scss'],
  providers: [SupportTiersService],
})
export class ChannelShopBriefComponent implements OnDestroy {
  /**
   * Channel GUID subscription
   */
  protected channelGuidSubscription: Subscription;

  /**
   * Constructor. Set channel GUID subscription.
   * @param service
   * @param supportTiers
   * @param wireModal
   */
  constructor(
    public service: ChannelsV2Service,
    public supportTiers: SupportTiersService,
    public channelService: ChannelsV2Service,
    protected wireModal: WireModalService
  ) {
    this.channelGuidSubscription = this.service.guid$.subscribe((guid) =>
      this.supportTiers.setEntityGuid(guid)
    );
  }

  /**
   * Component destroy
   */
  ngOnDestroy(): void {
    if (this.channelGuidSubscription) {
      this.channelGuidSubscription.unsubscribe();
    }
  }

  /**
   * Triggers Wire modal
   * @param channel
   * @param supportTier
   */
  async onEntryClick(channel: MindsUser, supportTier: SupportTier) {
    await this.wireModal.present(channel, {
      supportTier,
    });
    this.supportTiers.refresh();
  }
}
