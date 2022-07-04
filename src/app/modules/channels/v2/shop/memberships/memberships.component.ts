import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { Currency } from '../../../../../helpers/currency';
import { ChannelsV2Service } from '../../channels-v2.service';
import {
  SupportTier,
  SupportTiersService,
} from '../../../../wire/v2/support-tiers.service';
import { map } from 'rxjs/operators';
import { ChannelShopMembershipsService } from './memberships.service';
import { ChannelShopMembershipsEditModalService } from './edit-modal.service';
import { WireModalService } from '../../../../wire/wire-modal.service';
import { ChannelShopMembershipsMembersComponent } from './members-modal/members-modal.component';
import { ModalService } from '../../../../../services/ux/modal.service';

/**
 * Contains an 'm-carousel' that displays a channel's membership tiers, as well as a top action bar for viewing supporters, editing tiers
 */
@Component({
  selector: 'm-channelShop__memberships',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'memberships.component.html',
  styleUrls: ['memberships.component.ng.scss'],
  providers: [
    SupportTiersService,
    ChannelShopMembershipsService,
    ChannelShopMembershipsEditModalService,
  ],
})
export class ChannelShopMembershipsComponent implements OnDestroy {
  /**
   * Currency filter subject
   */
  readonly currencyFilter$: BehaviorSubject<Currency> = new BehaviorSubject<
    Currency
  >('usd');

  /**
   * Is the current view a draft?
   * @todo Implement
   */
  readonly isDraft$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Support Tiers filtered list
   */
  readonly supportTiers$: Observable<Array<SupportTier>> = combineLatest([
    this.currencyFilter$,
    this.channel.isOwner$,
    this.supportTiers.list$,
  ]).pipe(
    map(
      ([currencyFilter, isOwner, supportTiers]): Array<SupportTier> =>
        supportTiers.filter(supportTier => {
          return true;
          // if (isOwner) {
          //   return true;
          // }

          // switch (currencyFilter) {
          //   case 'usd':
          //     return supportTier.has_usd;
          //   case 'tokens':
          //     return supportTier.has_tokens;
          //   default:
          //     return true;
          // }
        })
    )
  );

  /**
   * Subscription to channel's GUID
   */
  protected channelGuidSubscription: Subscription;

  /**
   * Constructor
   * @param channel
   * @param supportTiers
   * @param service
   * @param editModal
   * @param wireModal
   * @param modalService
   */
  constructor(
    public channel: ChannelsV2Service,
    public supportTiers: SupportTiersService,
    protected service: ChannelShopMembershipsService,
    protected editModal: ChannelShopMembershipsEditModalService,
    protected wireModal: WireModalService,
    protected modalService: ModalService
  ) {
    this.channelGuidSubscription = this.channel.guid$.subscribe(guid =>
      this.supportTiers.setEntityGuid(guid)
    );
  }

  /**
   * Destroy lifecycle hook
   */
  ngOnDestroy() {
    if (this.channelGuidSubscription) {
      this.channelGuidSubscription.unsubscribe();
    }
  }

  /**
   * Create a new Support Tier using Edit modal
   * @todo Use an observable subscription to allow modal auto-close when navigating away
   */
  async create(): Promise<void> {
    await this.editModal.present();
    this.supportTiers.refresh();
  }

  /**
   * Select a Support Tier using Pay modal
   * @param supportTier
   */
  async select(supportTier: SupportTier): Promise<void> {
    await this.wireModal.present(this.channel.channel$.getValue(), {
      supportTier,
    });

    this.supportTiers.refresh();
  }

  /**
   * Edit a Support Tier using Edit modal
   * @param supportTier
   * @todo Use an observable subscription to allow modal auto-close when navigating away
   */
  async edit(supportTier: SupportTier): Promise<void> {
    await this.editModal.present(supportTier);
    this.supportTiers.refresh();
  }

  /**
   * Delete a Support Tier
   * @param supportTier
   */
  async delete(supportTier: SupportTier): Promise<void> {
    if (!confirm('Are you sure?')) {
      return;
    }

    await this.service.delete(supportTier).toPromise();
    this.supportTiers.refresh();
  }

  async openMembersModal(e: MouseEvent): Promise<void> {
    this.modalService.present(ChannelShopMembershipsMembersComponent, {
      data: {
        channel: this.channel.channel$.getValue(),
      },
    });
  }
}
