import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  GetGiftCardsGQL,
  GetGiftCardsQuery,
  GetGiftCardsQueryVariables,
  GiftCardEdge,
  GiftCardNode,
  GiftCardOrderingEnum,
  GiftCardProductIdEnum,
  GiftCardStatusFilterEnum,
  PageInfo,
} from '../../../../../../graphql/generated.engine';
import { GiftCardService } from '../../../../gift-card/gift-card.service';
import { BehaviorSubject, Observable, Subscription, map, skip } from 'rxjs';
import { Filter, Option } from '../../../../../interfaces/dashboard';
import { DropdownSelectorSelection } from '../../../../../common/components/dropdown-selector/dropdown-selector.component';
import { QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

/** Status filter options. */
type StatusFilterOptions = {
  statusFilter: GiftCardStatusFilterEnum;
  ordering: GiftCardOrderingEnum;
};

/**
 * Wallet section for history of Gift Card credits - shows a log of all gift cards
 * that can be filtered by active and expired states.
 */
@Component({
  selector: 'm-walletV2__historySummary',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.ng.scss'],
})
export class WalletV2CreditsHistoryComponent implements OnInit, OnDestroy {
  public readonly GiftCardProductIdEnum: typeof GiftCardProductIdEnum = GiftCardProductIdEnum;

  /** Dropdown menu options for status filter. */
  public readonly statusFilter: Filter = {
    id: 'status',
    label: 'Status',
    options: [
      {
        id: GiftCardStatusFilterEnum.Active,
        label: 'Active',
      },
      {
        id: GiftCardStatusFilterEnum.Expired,
        label: 'Expired',
      },
    ],
  };

  /** Gift cards to display. */
  public readonly giftCards$: BehaviorSubject<
    GiftCardNode[]
  > = new BehaviorSubject<GiftCardNode[]>([]);

  /** Info for the last loaded page. */
  private readonly pageInfo$: BehaviorSubject<PageInfo> = new BehaviorSubject<
    PageInfo
  >(null);

  /** Whether component is in it's initial loading state. */
  public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  /** Whether fetching more is currently in progress. */
  public readonly fetchMoreInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(true);

  /** Limit / pagesize of batches of cards. */
  private readonly limit: number = 10;

  /** Cursor for pagination. */
  private cursor: string = '';

  /** Query reference for gift cards query. */
  private giftCardsQuery: QueryRef<
    GetGiftCardsQuery,
    GetGiftCardsQueryVariables
  >;

  /** Whether there is a next page for pagination. */
  public readonly hasNextPage$: Observable<boolean> = this.pageInfo$.pipe(
    map((pageInfo: PageInfo) => pageInfo?.hasNextPage)
  );

  // subscriptions.
  private queryParamSubscription: Subscription;
  private giftCardsSubscription: Subscription;

  constructor(
    private giftCardService: GiftCardService,
    private getGiftCardsGQL: GetGiftCardsGQL,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const initialStatusFilterParam: GiftCardStatusFilterEnum = this.route
      .snapshot.queryParams['statusFilter'];

    // Update the status filter option to match that of a given query param.
    this.updateSelectedStatusFilterOption(initialStatusFilterParam);
    // Initialize the query and request first page of data.
    this.initQuery(initialStatusFilterParam);
    //subscribe to query parameter changes.
    this.setupParamChangeSubscription();
  }

  ngOnDestroy(): void {
    this.giftCardsSubscription?.unsubscribe();
    this.queryParamSubscription?.unsubscribe();
  }

  /**
   * Fetches next page of gift cards.
   * @returns { Promise<void> }
   */
  public async fetchMore(): Promise<void> {
    this.fetchMoreInProgress$.next(true);

    await this.giftCardsQuery.fetchMore({
      variables: {
        after: this.cursor,
      },
    });

    this.fetchMoreInProgress$.next(false);
  }

  /**
   * Fired on status filter change. Updates query params - list change
   * is handled by query param subscription.
   * @param { DropdownSelectorSelection } option - selected option.
   */
  public onStatusFilterChanged(option: DropdownSelectorSelection): void {
    this.router.navigate([], {
      queryParams: { statusFilter: option.option.id },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Gets product name by product id.
   * @param { GiftCardBalanceByProductId } giftCardBalance - Gift card balance object to get name for.
   * @returns { string } - Product name for display.
   */
  public getProductNameByProductId(productId: GiftCardProductIdEnum): string {
    return this.giftCardService.getProductNameByProductId(productId);
  }

  /**
   * Track by function for iteration.
   * @param { number } i - index.
   * @param { GiftCardBalanceByProductId } GiftCardNode - list item we are iterating over.
   * @returns { string } - unique identifier for iteration.
   */
  public trackByFn(i: number, giftCard: GiftCardNode): string {
    return giftCard.guid;
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
   * Initialize the query, fetch initial data and setup subscription
   * to handle future pages triggered via fetch more.
   * @param { GiftCardStatusFilterEnum } statusFilter - initial status filter to load for.
   * @returns { void }
   */
  private initQuery(statusFilter: GiftCardStatusFilterEnum): void {
    this.giftCardsQuery = this.getGiftCardsGQL.watch(
      {
        first: this.limit,
        productId: null,
        ...this.getStatusFilterChangeParams(statusFilter),
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
        useInitialLoading: true,
      }
    );

    this.giftCardsSubscription = this.giftCardsQuery.valueChanges.subscribe(
      (result: ApolloQueryResult<GetGiftCardsQuery>): void => {
        if (result.loading) {
          return;
        }

        if (this.loading$.getValue()) {
          this.loading$.next(false);
        }

        this.giftCards$.next(
          result.data.giftCards.edges.map(
            (edge: GiftCardEdge): GiftCardNode => edge.node
          ) as GiftCardNode[]
        );
        this.pageInfo$.next(result.data.giftCards.pageInfo as PageInfo);
        this.cursor = result.data.giftCards.pageInfo.endCursor;
      }
    );
  }

  /**
   * Setup listener for query param change that will refetch data
   * when param changes.
   * @returns { void }
   */
  private setupParamChangeSubscription(): void {
    this.queryParamSubscription = this.route.queryParamMap
      .pipe(skip(1))
      .subscribe((params: ParamMap): void => {
        if (
          Object.values(GiftCardStatusFilterEnum).includes(
            params.get('statusFilter') as GiftCardStatusFilterEnum
          )
        ) {
          this.giftCardsQuery.refetch(
            this.getStatusFilterChangeParams(
              params.get('statusFilter') as GiftCardStatusFilterEnum
            )
          );
        }
      });
  }

  /**
   * Get params for status filter. Status filter changes WILL also update order.
   * @param { GiftCardStatusFilterEnum } statusFilter - status filter.
   * @returns { StatusFilterOptions } status filter options to be passed as GQL variables.
   */
  private getStatusFilterChangeParams(
    statusFilter: GiftCardStatusFilterEnum
  ): StatusFilterOptions {
    return statusFilter === GiftCardStatusFilterEnum.Expired
      ? {
          statusFilter: GiftCardStatusFilterEnum.Expired,
          ordering: GiftCardOrderingEnum.ExpiringDesc,
        }
      : {
          statusFilter: GiftCardStatusFilterEnum.Active,
          ordering: GiftCardOrderingEnum.ExpiringAsc,
        };
  }

  /**
   * Update status filter selected value.
   * @param { void } statusFilter - status filter to set as selected.
   * @returns { void }
   */
  private updateSelectedStatusFilterOption(
    statusFilter: GiftCardStatusFilterEnum
  ): void {
    this.statusFilter.options.map(
      (option: Option): Option => {
        if (option.id === statusFilter) {
          option.selected = true;
        }
        return option;
      }
    );
  }
}
