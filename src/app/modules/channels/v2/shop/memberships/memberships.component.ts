import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { Currency } from '../../../../../helpers/currency';
import { ChannelsV2Service } from '../../channels-v2.service';
import {
  SupportTier,
  SupportTiersService,
} from '../../../../wire/v2/support-tiers.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'm-channelShop__memberships',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'memberships.component.html',
  providers: [SupportTiersService],
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
          if (isOwner) {
            return true;
          }

          switch (currencyFilter) {
            case 'usd':
              return supportTier.has_usd;
            case 'tokens':
              return supportTier.has_tokens;
            default:
              return true;
          }
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
   */
  constructor(
    public channel: ChannelsV2Service,
    public supportTiers: SupportTiersService
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
   */
  create(): void {}

  /**
   * Select a Support Tier using Pay modal
   * @param supportTier
   */
  select(supportTier: SupportTier): void {}

  /**
   * Edit a Support Tier using Edit modal
   * @param supportTier
   */
  edit(supportTier: SupportTier): void {}

  /**
   * Delete a Support Tier
   * @param supportTier
   */
  delete(supportTier: SupportTier): void {}
}
