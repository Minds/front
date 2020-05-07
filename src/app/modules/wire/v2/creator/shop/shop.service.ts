import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { WireTokenType, WireType, WireV2Service } from '../../wire-v2.service';
import { SupportTier, SupportTiersService } from '../../support-tiers.service';

/**
 * Two-way logic for shop subscription tier selector
 */
@Injectable()
export class ShopService implements OnDestroy {
  /**
   * Currently selected ID, might be manually changed or auto-selected by changing Wire values
   */
  readonly selected$: BehaviorSubject<SupportTier> = new BehaviorSubject<
    SupportTier
  >(null);

  /**
   * Subscription to state values
   */
  protected valuesSubscription: Subscription;

  /**
   * Constructor. Setup subscription.
   * @param wire
   * @param supportTiers
   */
  constructor(
    public wire: WireV2Service,
    public supportTiers: SupportTiersService
  ) {
    this.valuesSubscription = combineLatest([
      this.wire.type$,
      this.wire.tokenType$,
      this.wire.amount$,
      this.wire.recurring$,
      this.supportTiers.list$,
    ]).subscribe(([type, tokenType, amount, recurring, supportTiers]) =>
      this.selectBestMatch(type, tokenType, amount, recurring, supportTiers)
    );
  }

  /**
   * Destroy. Remove subscription.
   */
  ngOnDestroy(): void {
    if (this.valuesSubscription) {
      this.valuesSubscription.unsubscribe();
    }
  }

  /**
   * Update selection when values change
   * @param type
   * @param tokenType
   * @param amount
   * @param recurring
   * @param supportTiers
   */
  selectBestMatch(
    type: WireType,
    tokenType: WireTokenType,
    amount: number,
    recurring: boolean,
    supportTiers: Array<SupportTier>
  ): ShopService {
    if (
      !this.wire.canRecur(type, tokenType) ||
      !recurring ||
      !supportTiers ||
      !supportTiers.length
    ) {
      this.selected$.next(null);
      return this;
    }

    this.selected$.next(
      supportTiers
        .filter(supportTier => supportTier.currency === type)
        .reverse()
        .find(supportTier => supportTier.amount <= amount) || null
    );

    return this;
  }

  /**
   * Sets the selected reward values based on the ID (type:amount)
   * @param supportTier
   */
  select(supportTier: SupportTier): void {
    this.selected$.next(supportTier);

    if (!supportTier) {
      // If empty, don't attempt to hydrate values
      return;
    }

    if (isNaN(supportTier.amount)) {
      return;
    }

    switch (supportTier.currency) {
      case 'tokens':
        this.wire.setType('tokens');
        this.wire.setTokenType('offchain');
        break;

      case 'usd':
        this.wire.setType('usd');
        break;

      default:
        throw new Error(
          `Invalid type (cannot recur): ${JSON.stringify(supportTier)}`
        );
    }

    this.wire.setAmount(supportTier.amount);
    this.wire.setRecurring(true);
  }
}
