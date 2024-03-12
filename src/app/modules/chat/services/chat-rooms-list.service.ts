import { Injectable } from '@angular/core';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  of,
  take,
} from 'rxjs';
import {
  ChatRoomEdge,
  GetChatRoomsListGQL,
  GetChatRoomsListQuery,
  GetChatRoomsListQueryVariables,
  PageInfo,
} from '../../../../graphql/generated.engine';
import { QueryRef } from 'apollo-angular';
import { ToasterService } from '../../../common/services/toaster.service';
import { ApolloQueryResult } from '@apollo/client';

/** Size of an individual page. */
const PAGE_SIZE: number = 24;

@Injectable({ providedIn: 'root' })
export class ChatRoomsListService extends AbstractSubscriberComponent {
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

  /** Internal subject to hold the page info for the chat rooms list. */
  private readonly _pageInfo$: BehaviorSubject<PageInfo> = new BehaviorSubject<
    PageInfo
  >(null);

  /** Exposed observable that represents the page info for the chat rooms list. */
  public readonly pageInfo$: Observable<
    PageInfo
  > = this._pageInfo$.asObservable();

  /** Internal subject to hold the edges for the chat rooms list. */
  private readonly _edges$: BehaviorSubject<
    ChatRoomEdge[]
  > = new BehaviorSubject<ChatRoomEdge[]>([]);

  /** Exposed observable that represents the edges for the chat rooms list. */
  public readonly edges$: Observable<
    ChatRoomEdge[]
  > = this._edges$.asObservable();

  /** Internal reference to the query. */
  private queryRef: QueryRef<
    GetChatRoomsListQuery,
    GetChatRoomsListQueryVariables
  >;

  constructor(
    private getChatRoomsListGql: GetChatRoomsListGQL,
    private toaster: ToasterService
  ) {
    super();
  }

  /**
   * Initializes the service with the given parameters.
   * @returns { void }
   */
  public init(): void {
    this.initQueryRef();
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
   * Refetch rooms.
   * @returns { void }
   */
  public refetch(): void {
    this.queryRef.refetch();
  }

  /**
   * Initializes the query reference.
   * @returns { void }
   */
  private initQueryRef(): void {
    this.queryRef = this.getChatRoomsListGql.watch(
      {
        after: null,
        first: PAGE_SIZE,
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
        .subscribe((result: ApolloQueryResult<GetChatRoomsListQuery>): void => {
          try {
            if (!result || result.loading) {
              return;
            }

            if (result?.errors?.length) {
              throw new Error(result.errors[0].message);
            }

            this._inProgress$.next(false);
            this._initialized$.next(true);

            if (!result || !result?.data?.chatRoomList?.edges?.length) {
              console.info('No chat rooms found');
              return;
            }

            this._edges$.next(
              result?.data?.chatRoomList?.edges as ChatRoomEdge[]
            );
            this._pageInfo$.next(result?.data?.chatRoomList?.pageInfo);
          } catch (e) {
            this.handleError(e);
          }
        })
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
