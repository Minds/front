import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { WireTokenType, WireType, WireV2Service } from '../../wire-v2.service';

/**
 * Two-way logic for shop subscription tier selector
 */
@Injectable()
export class ShopService implements OnDestroy {
  /**
   * Currently selected ID, might be manually changed or auto-selected by changing Wire values
   */
  readonly selectedId$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  /**
   * Subscription to state values
   */
  protected valuesSubscription: Subscription;

  /**
   * Constructor. Setup subscription.
   * @param wire
   */
  constructor(public wire: WireV2Service) {
    this.valuesSubscription = combineLatest([
      this.wire.type$,
      this.wire.tokenType$,
      this.wire.amount$,
      this.wire.recurring$,
    ]).subscribe(([type, tokenType, amount, recurring]) =>
      this.findSelectedId(type, tokenType, amount, recurring)
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
   * Sets the currently selected ID
   * @param selectedId
   */
  setSelectedId(selectedId: string): ShopService {
    this.selectedId$.next(selectedId);
    return this;
  }

  /**
   * Update selection when values change
   * @param type
   * @param tokenType
   * @param amount
   * @param recurring
   */
  findSelectedId(
    type: WireType,
    tokenType: WireTokenType,
    amount: number,
    recurring: boolean
  ): ShopService {
    const wireRewards = this.wire.wireRewards$.getValue();

    if (
      !wireRewards ||
      !wireRewards[type] ||
      !this.wire.canRecur(type, tokenType) ||
      !recurring
    ) {
      this.setSelectedId('');
      return this;
    }

    let selectedId = '';

    for (let i = wireRewards[type].length - 1; i >= 0; i--) {
      const entry = wireRewards[type][i];

      if (entry.amount <= amount) {
        selectedId = entry.id;
        break;
      }
    }

    this.setSelectedId(selectedId);
    return this;
  }

  /**
   * Sets the selected reward values based on the ID (type:amount)
   * @param selectedId
   */
  select(selectedId: string): void {
    this.setSelectedId(selectedId);

    if (!selectedId) {
      // If empty, don't attempt to hydrate values
      return;
    }

    const [type, amountString] = selectedId.split(':');
    const amount = parseFloat(amountString);

    if (isNaN(amount)) {
      return;
    }

    switch (type) {
      case 'tokens':
        this.wire.setType('tokens');
        this.wire.setTokenType('offchain');
        break;

      case 'usd':
        this.wire.setType('usd');
        break;

      default:
        throw new Error(`Invalid type (cannot recur): ${type}`);
    }

    this.wire.setAmount(amount);
    this.wire.setRecurring(true);
  }
}
