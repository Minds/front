import { Component, OnDestroy, OnInit } from '@angular/core';
import { GiftCardBalanceByProductId } from '../../../../../../graphql/generated.engine';
import { GiftCardService } from '../../../../gift-card/gift-card.service';
import { BehaviorSubject, Subscription, take } from 'rxjs';

/**
 * Wallet section for summary of Gift Card credits - shows at the top of tab.
 */
@Component({
  selector: 'm-walletV2__creditsSummary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.ng.scss'],
})
export class WalletV2CreditsSummaryComponent implements OnInit, OnDestroy {
  /** Balances of various gift cards. */
  public readonly giftCardBalances$: BehaviorSubject<
    GiftCardBalanceByProductId[]
  > = new BehaviorSubject<GiftCardBalanceByProductId[]>(null);

  // subscription to getting balances.
  private getBalancesSubscription: Subscription;

  constructor(private giftCardService: GiftCardService) {}

  ngOnInit(): void {
    this.getBalancesSubscription = this.giftCardService
      .getGiftCardBalancesWithExpiryData({ fetchPolicy: 'no-cache' })
      .pipe(take(1))
      .subscribe((result: GiftCardBalanceByProductId[]): void => {
        // slice is used below to create a mutable copy of the array.
        this.giftCardBalances$.next(
          result.slice().sort((a, b) => b.balance - a.balance)
        );
      });
  }

  ngOnDestroy(): void {
    this.getBalancesSubscription?.unsubscribe();
  }

  /**
   * Gets product name by product id.
   * @param { GiftCardBalanceByProductId } giftCardBalance - Gift card balance object to get name for.
   * @returns { string } - Product name for display.
   */
  public getProductName(giftCardBalance: GiftCardBalanceByProductId): string {
    return this.giftCardService.getProductNameByProductId(
      giftCardBalance.productId
    );
  }

  /**
   * Track by function for iteration.
   * @param { number } i - index.
   * @param { GiftCardBalanceByProductId } giftCardBalance - list item we are iterating over.
   * @returns { string } - unique identifier for iteration.
   */
  public trackByFn(
    i: number,
    giftCardBalance: GiftCardBalanceByProductId
  ): string {
    return giftCardBalance.productId;
  }
}
