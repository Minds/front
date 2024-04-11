import { Component, Optional } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ChannelShopMembershipsMembersService } from './members.service';
import { Filter, Option } from '../../../../../../interfaces/dashboard';
import { SupportTiersService } from '../../../../../wire/v2/support-tiers.service';
import { MessengerConversationDockpanesService } from '../../../../../messenger/dockpanes/dockpanes.service';
import { MessengerConversationBuilderService } from '../../../../../messenger/dockpanes/conversation-builder.service';
import { MindsUser } from '../../../../../../interfaces/entities';

const ALL_TIERS: Option = { label: 'All tiers', id: '' };

/**
 * Modal that displays a list of users who are members of a channel's membership tiers
 */
@Component({
  selector: 'm-channelShopMemberships__membersModal',
  templateUrl: 'members-modal.component.html',
  styleUrls: ['members-modal.component.ng.scss'],
  providers: [ChannelShopMembershipsMembersService, SupportTiersService],
})
export class ChannelShopMembershipsMembersComponent {
  inProgress$: Observable<boolean> = this.service.inProgress$;
  supportTierMembers$: Observable<any> = this.service.supportTierMembers$;

  supportTiersFilter: Filter = {
    id: 'support-tiers',
    label: '',
    options: [ALL_TIERS],
  };

  supportTiersSubscription: Subscription;

  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = () => {};

  constructor(
    private service: ChannelShopMembershipsMembersService,
    private supportTiersService: SupportTiersService,
    protected dockpanes: MessengerConversationDockpanesService,
    protected conversationBuilder: MessengerConversationBuilderService
  ) {}

  /**
   * Modal options
   * @param onDismissIntent
   * @param channel
   */
  setModalData({ onDismissIntent, channel }) {
    this.onDismissIntent = onDismissIntent || (() => {});
    this.service.entityGuid$.next(channel.guid);
    this.supportTiersService.setEntityGuid(channel.guid);
  }

  ngOnInit() {
    this.supportTiersSubscription = this.supportTiersService.list$.subscribe(
      (supportTiers) => {
        this.supportTiersFilter.options = [ALL_TIERS];
        for (const supportTier of supportTiers) {
          this.supportTiersFilter.options.push({
            label: supportTier.name,
            id: supportTier.urn,
          });
        }
      }
    );
  }

  ngOnDestroy() {
    this.supportTiersSubscription.unsubscribe();
  }

  onMessageButtonClicked(user: MindsUser) {
    this.dockpanes.open(this.conversationBuilder.buildConversation(user));
    this.onDismissIntent();
  }

  supportTierSelected(e) {
    const option: Option = e.option;
    this.service.supportTierFilter$.next(option.id);
  }
}
