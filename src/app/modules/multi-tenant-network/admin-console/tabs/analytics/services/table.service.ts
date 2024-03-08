import { Injectable } from '@angular/core';
import {
  AnalyticsTableEnum,
  AnalyticsTableRowEdge,
  GetTenantAnalyticsTableGQL,
  GetTenantAnalyticsTableQuery,
  GetTenantAnalyticsTableQueryVariables,
  PageInfo,
} from '../../../../../../../graphql/generated.engine';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  of,
  shareReplay,
  take,
} from 'rxjs';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
import { AbstractSubscriberComponent } from '../../../../../../common/components/abstract-subscriber/abstract-subscriber.component';

/** Size of an individual page. */
const PAGE_SIZE: number = 24;

/**
 * Service for fetching network admin analytics table data.
 */
@Injectable()
export class NetworkAdminAnalyticsTableService extends AbstractSubscriberComponent {
  /** Internal subject to hold whether a request is in progress. */
  private readonly _inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  /** Exposed observable that represents whether a request is in progress. */
  public readonly inProgress$: Observable<
    boolean
  > = this._inProgress$.asObservable();

  /** Internal subject to hold whether the service has been initialized. */
  private readonly _initialized$: Subject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /** Exposed observable that represents whether the service has been initialized. */
  public readonly initialized$: Observable<
    boolean
  > = this._initialized$.asObservable();

  /** Internal subject to hold the page info for the analytics table. */
  private readonly _pageInfo$: BehaviorSubject<PageInfo> = new BehaviorSubject<
    PageInfo
  >(null);

  /** Exposed observable that represents the page info for the analytics table. */
  public readonly pageInfo$: Observable<
    PageInfo
  > = this._pageInfo$.asObservable();

  /** Internal subject to hold the edges for the analytics table. */
  private readonly _edges$: BehaviorSubject<
    AnalyticsTableRowEdge[]
  > = new BehaviorSubject<AnalyticsTableRowEdge[]>([]);

  /** Exposed observable that represents the edges for the analytics table. */
  public readonly edges$: Observable<
    AnalyticsTableRowEdge[]
  > = this._edges$.asObservable();

  /** Internal reference to the query. */
  private queryRef: QueryRef<
    GetTenantAnalyticsTableQuery,
    GetTenantAnalyticsTableQueryVariables
  >;

  constructor(
    private getTenantAnalyticsTableGQL: GetTenantAnalyticsTableGQL,
    private toaster: ToasterService
  ) {
    super();
  }

  /**
   * Initializes the service with the given parameters.
   * @param { AnalyticsTableEnum } tableType - the type of table to fetch.
   * @param { number } fromUnixTimestamp - the start of the time range to fetch.
   * @param { number } toUnixTimestamp - the end of the time range to fetch.
   * @returns { void }
   */
  public init(
    tableType: AnalyticsTableEnum,
    fromUnixTimestamp: number,
    toUnixTimestamp: number
  ): void {
    this.initQueryRef(tableType, fromUnixTimestamp, toUnixTimestamp);
    this.subscribeToValueChanges();
  }

  /**
   * Fetches more data for the table.
   * @returns { void }
   */
  public fetchMore(): void {
    this.subscriptions.push(
      this.pageInfo$.pipe(take(1)).subscribe((pageInfo: PageInfo): void => {
        this._inProgress$.next(true);

        this.queryRef.fetchMore({
          variables: {
            after: pageInfo.endCursor,
          },
        });
      })
    );
  }

  /**
   * Initializes the query reference.
   * @param { AnalyticsTableEnum } tableType - the type of table to fetch.
   * @param { number } fromUnixTimestamp - the start of the time range to fetch.
   * @param { number } toUnixTimestamp - the end of the time range to fetch.
   * @returns { void }
   */
  private initQueryRef(
    tableType: AnalyticsTableEnum,
    fromUnixTimestamp: number,
    toUnixTimestamp: number
  ): void {
    this.queryRef = this.getTenantAnalyticsTableGQL.watch(
      {
        table: tableType,
        fromUnixTs: fromUnixTimestamp,
        toUnixTs: toUnixTimestamp,
        limit: PAGE_SIZE,
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
        useInitialLoading: true,
      }
    );
  }

  /**
   * Subscribes to value changes on the query reference.
   * @returns { void }
   */
  private subscribeToValueChanges(): void {
    if (!this.queryRef) {
      console.warn(
        'Attempted to subscribe to value changes before initializing query reference'
      );
      return;
    }

    this.subscriptions.push(
      this.queryRef.valueChanges
        .pipe(
          catchError(e => {
            this.handleError(e);
            return of(null);
          })
        )
        .subscribe(
          (result: ApolloQueryResult<GetTenantAnalyticsTableQuery>): void => {
            try {
              if (result.loading) {
                return;
              }

              if (!result || !result?.data?.tenantAdminAnalyticsTable) {
                throw new Error('No results found');
              }

              if (result?.errors?.length) {
                throw new Error(result.errors[0].message);
              }

              this._edges$.next(result?.data?.tenantAdminAnalyticsTable?.edges);
              this._inProgress$.next(false);
              this._initialized$.next(true);
              this._pageInfo$.next(
                result?.data?.tenantAdminAnalyticsTable?.pageInfo
              );
            } catch (e) {
              this.handleError(e);
            }
          }
        )
    );
  }

  /**
   * Handles an error.
   * @param { any } e - the error to handle.
   * @returns { void }
   */
  private handleError(e: any): void {
    console.error(e);
    this.toaster.error(e?.message);
    this._inProgress$.next(false);
  }
}
