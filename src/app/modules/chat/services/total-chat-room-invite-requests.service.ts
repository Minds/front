import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  of,
} from 'rxjs';
import {
  GetTotalRoomInviteRequestsGQL,
  GetTotalRoomInviteRequestsQuery,
  GetTotalRoomInviteRequestsQueryVariables,
} from '../../../../graphql/generated.engine';
import { QueryRef } from 'apollo-angular';
import { ToasterService } from '../../../common/services/toaster.service';
import { ApolloQueryResult } from '@apollo/client';

/**
 * Service for getting the logged in users total chat room invite requests.
 */
@Injectable()
export class TotalChatRoomInviteRequestsService implements OnDestroy {
  /** Internal subject to hold total requests. */
  private readonly _totalRequests$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(0);

  /** Exposed observable that represents total requests. */
  public readonly totalRequests$: Observable<
    number
  > = this._totalRequests$.asObservable();

  /** Internal subject to hold total requests. */
  private readonly _initialized$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Exposed observable that represents total requests. */
  public readonly initialized$: Observable<
    boolean
  > = this._initialized$.asObservable();

  /** Internal reference to the query. */
  private queryRef: QueryRef<
    GetTotalRoomInviteRequestsQuery,
    GetTotalRoomInviteRequestsQueryVariables
  >;

  /** Subscriptions. */
  private totalRequestsValueChangeSubscription: Subscription;

  constructor(
    private getTotalRoomInviteRequestsGQL: GetTotalRoomInviteRequestsGQL,
    private toaster: ToasterService
  ) {}

  ngOnDestroy(): void {
    this.totalRequestsValueChangeSubscription?.unsubscribe();
  }

  /**
   * Initializes the service and queryRef.
   * @returns { void }
   */
  public init(): void {
    if (this.queryRef) {
      console.warn('QueryRef already exists. Not initializing again.');
      return;
    }

    this.queryRef = this.getTotalRoomInviteRequestsGQL.watch(null, {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: false,
      errorPolicy: 'all',
      useInitialLoading: true,
    });

    this.totalRequestsValueChangeSubscription = this.queryRef.valueChanges
      .pipe(catchError((e: any): Observable<null> => this.handleError(e)))
      .subscribe(
        (result: ApolloQueryResult<GetTotalRoomInviteRequestsQuery>): void => {
          try {
            if (!result || result.loading) {
              return;
            }

            if (result?.errors?.length) {
              throw new Error(result.errors[0].message);
            }

            if (!this._initialized$.getValue()) {
              this._initialized$.next(true);
            }

            this._totalRequests$.next(
              result.data?.totalRoomInviteRequests ?? 0
            );
          } catch (e) {
            this.handleError(e);
          }
        }
      );
  }

  /**
   * Refetch rooms.
   * @returns { void }
   */
  public refetch(): void {
    this.queryRef.refetch();
  }

  /**
   * Handles an error.
   * @param { any } e - the error to handle.
   * @returns { void }
   */
  private handleError(e: any): Observable<null> {
    console.error(e);
    this.toaster.error(e?.message);

    if (!this._initialized$.getValue()) {
      this._initialized$.next(true);
    }

    return of(null);
  }
}
