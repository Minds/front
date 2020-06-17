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

  readonly supportTiers$: Observable<Array<SupportTier>> = combineLatest([
    this.currencyFilter$,
    this.supportTiers.list$,
  ]).pipe(
    map(
      ([currencyFilter, supportTiers]): Array<SupportTier> =>
        supportTiers.filter(supportTier => {
          switch (currencyFilter) {
            case 'usd':
              return supportTier.has_usd;
            case 'tokens':
              return supportTier.has_tokens;
          }

          return true;
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

  ngOnDestroy() {
    if (this.channelGuidSubscription) {
      this.channelGuidSubscription.unsubscribe();
    }
  }

  select(supportTier: SupportTier): void {}

  edit(supportTier: SupportTier): void {}

  delete(supportTier: SupportTier): void {}
}
