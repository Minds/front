import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GetGiftCardGQL,
  GetGiftCardQuery,
  GetGiftCardTransactionsLedgerGQL,
  GetGiftCardTransactionsLedgerQuery,
  GetGiftCardTransactionsLedgerQueryVariables,
  GiftCardNode,
  GiftCardProductIdEnum,
  GiftCardTransaction,
  GiftCardTransactionEdge,
  PageInfo,
} from '../../../../../../../graphql/generated.engine';
import { BehaviorSubject, Observable, Subscription, map, take } from 'rxjs';
import { QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
import { GiftCardService } from '../../../../../gift-card/gift-card.service';
import * as moment from 'moment';

/**
 * Gift card transaction history component. Will load the transactions
 * for the gift card matching the given route param guid.
 */
@Component({
  selector: 'm-walletV2__transactionHistorySummary',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.ng.scss'],
})
export class WalletV2CreditsTransactionHistoryComponent
  implements OnInit, OnDestroy
{
  /** Gift card transactions for display. */
  public readonly giftCardTransactions$: BehaviorSubject<
    GiftCardTransaction[]
  > = new BehaviorSubject<GiftCardTransaction[]>([]);

  /** Whether fetch more is in progress. */
  public readonly fetchMoreInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /** Whether initial load is in progress. */
  public readonly loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /** Gift card data to display in summary at top. */
  public readonly giftCard$: BehaviorSubject<GiftCardNode> =
    new BehaviorSubject<GiftCardNode>(null);

  /** Info for the current page. */
  private readonly pageInfo$: BehaviorSubject<PageInfo> =
    new BehaviorSubject<PageInfo>(null);

  /** Limit / pagesize of batches of cards. */
  private readonly limit: number = 10;

  /** Cursor for pagination. */
  private cursor: string = '';

  /** Query reference for gift card transactions query. */
  private giftCardTransactionsQuery: QueryRef<
    GetGiftCardTransactionsLedgerQuery,
    GetGiftCardTransactionsLedgerQueryVariables
  >;

  /** Running total of transaction balance. */
  private runningTotal: number = 0;

  /** Used to store balance of previous TX when mapping transactions to a table friendly format. */
  private previousTxAmount: number = 0;

  /** Used to store the current day when mapping transactions  to a table friendly format */
  private currentDayInLoop: moment.Moment = moment();

  // subscriptions
  private giftCardTransactionsSubscription: Subscription;
  private giftCardSubscription: Subscription;

  /** Whether there is a next page for pagination. */
  public readonly hasNextPage$: Observable<boolean> = this.pageInfo$.pipe(
    map((pageInfo: PageInfo) => pageInfo?.hasNextPage)
  );

  /** Transactions formatted for injection into the transactions table. */
  public readonly formattedTransactions$: Observable<any[]> =
    this.giftCardTransactions$.pipe(
      map((transactions: GiftCardTransaction[]): any[] =>
        this.formatTransactions(transactions, true)
      )
    );

  constructor(
    private route: ActivatedRoute,
    private giftCardService: GiftCardService,
    private getGiftCardTransactionsLedgerGQL: GetGiftCardTransactionsLedgerGQL,
    private getGiftCardGQL: GetGiftCardGQL
  ) {}

  ngOnInit(): void {
    const giftCardGuid: string =
      this.route.snapshot.paramMap.get('giftCardGuid');

    this.giftCardSubscription = this.getGiftCardGQL
      .fetch({ guid: giftCardGuid })
      .pipe(take(1))
      .subscribe((result: ApolloQueryResult<GetGiftCardQuery>) => {
        this.giftCard$.next(result?.data?.giftCard as GiftCardNode);
      });

    this.giftCardTransactionsQuery =
      this.getGiftCardTransactionsLedgerGQL.watch(
        {
          giftCardGuid: giftCardGuid,
          first: this.limit,
        },
        {
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-first',
          notifyOnNetworkStatusChange: false,
          errorPolicy: 'all',
          useInitialLoading: true,
        }
      );

    this.giftCardTransactionsSubscription =
      this.giftCardTransactionsQuery.valueChanges.subscribe(
        (
          result: ApolloQueryResult<GetGiftCardTransactionsLedgerQuery>
        ): void => {
          if (result.loading) {
            return;
          }

          if (this.loading$.getValue()) {
            this.loading$.next(false);
          }

          this.giftCardTransactions$.next(
            result.data.giftCardTransactionLedger.edges.map(
              (edge: GiftCardTransactionEdge): GiftCardTransaction => edge.node
            )
          );
          this.pageInfo$.next(
            result.data.giftCardTransactionLedger.pageInfo as PageInfo
          );
          this.cursor =
            result.data.giftCardTransactionLedger.pageInfo.endCursor;
        }
      );
  }

  ngOnDestroy(): void {
    this.giftCardSubscription?.unsubscribe();
    this.giftCardTransactionsSubscription?.unsubscribe();
  }

  /**
   * Fetches next page of gift card ledger transactions.
   * @returns { Promise<void> }
   */
  public async fetchMore(): Promise<void> {
    this.fetchMoreInProgress$.next(true);

    await this.giftCardTransactionsQuery.fetchMore({
      variables: {
        after: this.cursor,
      },
    });

    this.fetchMoreInProgress$.next(false);
  }

  /**
   * Track by function for iteration.
   * @param { number } i - index.
   * @param { GiftCardBalanceByProductId } GiftCardNode - list item we are iterating over.
   * @returns { string } - unique identifier for iteration.
   */
  public trackByFn(
    i: number,
    giftCardTransaction: GiftCardTransaction
  ): string {
    return giftCardTransaction.paymentGuid;
  }

  /**
   * Whether gift card is expired.
   * @param { boolean } giftCard - gift card to check.
   * @returns { boolean } true if gift card is expired.
   */
  public isExpired(giftCard: GiftCardNode): boolean {
    return giftCard.expiresAt * 1000 < Date.now();
  }

  /**
   * Gets product name by product id.
   * @param { GiftCardBalanceByProductId } giftCardBalance - Gift card balance object to get name for.
   * @returns { string } - Product name for display.
   */
  public getProductNameByProductId(productId: GiftCardProductIdEnum): string {
    return this.giftCardService.getProductNameByProductId(productId, false);
  }

  /**
   * Format given transactions in a transactions table friendly format.
   * @param { GiftCardTransaction[] } transactions - transactions to format.
   * @param { boolean } refresh - whether to refresh running count.
   * @returns { any[] } formatted transactions.
   */
  private formatTransactions(
    transactions: GiftCardTransaction[],
    refresh: boolean = false
  ): any[] {
    return transactions.map((tx: GiftCardTransaction, i) => {
      const formattedTx: any = { ...tx };

      // set TX delta, telling table whether to display as up arrow or down arrow.
      formattedTx.delta = tx.amount < 0 ? 'negative' : 'positive';

      if (Boolean(tx.refundedAt)) {
        // If refunded, force displayed value to 0.
        formattedTx.amount = 0;
      } else {
        // flip negative values to positive - delta indicates direction already.
        formattedTx.amount = Math.abs(formattedTx.amount);
      }

      // set types based upon what kind of transaction we're formatting.
      if (tx.boostGuid) {
        formattedTx.superType = 'boost';
        formattedTx.type = 'credit:boost';
      } else {
        formattedTx.type = 'unknown';
        formattedTx.superType = 'unknown';
      }

      /**
       * the only positive delta transactions possible in this context
       * are when the tx is the initial redemption of the gift card.
       */
      if (formattedTx.delta === 'positive') {
        formattedTx.superType = 'credit:deposit';
        formattedTx.otherUser = this.getOtherUser(
          tx.giftCardIssuerGuid,
          tx.giftCardIssuerName
        );
      }

      if (i !== 0 || !refresh) {
        this.runningTotal -= this.previousTxAmount;
      }

      this.previousTxAmount = formattedTx.amount;

      formattedTx.runningTotal = this.runningTotal;

      const txMoment: moment.Moment = moment(tx.createdAt * 1000).local();
      formattedTx.displayDate = null;
      formattedTx.displayTime = txMoment.format('hh:mm a');

      if (this.isNewDay(this.currentDayInLoop, txMoment)) {
        this.currentDayInLoop = txMoment;

        // If tx occurred yesterday, use 'yesterday' instead of date.
        const yesterday: moment.Moment = moment().subtract(1, 'day');
        if (txMoment.isSame(yesterday, 'day')) {
          formattedTx.displayDate = 'Yesterday';
        } else {
          formattedTx.displayDate = moment(txMoment).format('ddd MMM Do');
        }
      }

      return formattedTx;
    });
  }

  /**
   * Whether two moments are on the same day.
   * @param { moment.Moment } moment1 - moment to compare.
   * @param { moment.Moment } moment2 - moment to compare.
   * @returns { boolean } true if moments are on the same day.
   */
  private isNewDay(moment1: moment.Moment, moment2: moment.Moment): boolean {
    return !moment1.isSame(moment2, 'day');
  }

  /**
   * Gets 'other user' for transaction table consumption. In this case
   * the other user will only ever be the gift card issuer.
   * @param { string } guid - guid of gift card issuer.
   * @param { string } username - username of the gift card issuer.
   * @returns { { avatar: string, username: string } } - other user object.
   */
  private getOtherUser(
    guid: string,
    username: string
  ): { avatar: string; username: string } {
    return {
      avatar: `/icon/${guid}/medium`,
      username: username,
    };
  }
}
