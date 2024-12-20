import { Injectable } from '@angular/core';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  lastValueFrom,
  of,
  take,
} from 'rxjs';
import {
  ChatRoomEdge,
  GetChatRoomGQL,
  GetChatRoomQuery,
  GetChatRoomsListGQL,
  GetChatRoomsListQuery,
  GetChatRoomsListQueryVariables,
  PageInfo,
} from '../../../../graphql/generated.engine';
import { QueryRef } from 'apollo-angular';
import { ToasterService } from '../../../common/services/toaster.service';
import { ApolloQueryResult } from '@apollo/client';
import {
  ChatRoomEvent,
  ChatRoomEventType,
  GlobalChatSocketService,
} from './global-chat-socket.service';
import { Session } from '../../../services/session';

/** Size of an individual page. */
export const PAGE_SIZE: number = 24;

@Injectable({ providedIn: 'root' })
export class ChatRoomsListService extends AbstractSubscriberComponent {
  /** Internal subject to hold whether a request is in progress. */
  private readonly _inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /** Exposed observable that represents whether a request is in progress. */
  public readonly inProgress$: Observable<boolean> =
    this._inProgress$.asObservable();

  /** Internal subject to hold whether the service has been initialized. */
  private readonly _initialized$: Subject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Exposed observable that represents whether the service has been initialized. */
  public readonly initialized$: Observable<boolean> =
    this._initialized$.asObservable();

  /** Internal subject to hold the page info for the chat rooms list. */
  private readonly _pageInfo$: BehaviorSubject<PageInfo> =
    new BehaviorSubject<PageInfo>(null);

  /** Exposed observable that represents the page info for the chat rooms list. */
  public readonly pageInfo$: Observable<PageInfo> =
    this._pageInfo$.asObservable();

  /** Internal subject to hold the edges for the chat rooms list. */
  private readonly _edges$: BehaviorSubject<ChatRoomEdge[]> =
    new BehaviorSubject<ChatRoomEdge[]>([]);

  /** Exposed observable that represents the edges for the chat rooms list. */
  public readonly edges$: Observable<ChatRoomEdge[]> =
    this._edges$.asObservable();

  /** Internal reference to the query. */
  private queryRef: QueryRef<
    GetChatRoomsListQuery,
    GetChatRoomsListQueryVariables
  >;

  /** Whether the chat room list is being viewed. */
  private isViewingChatRoomsList: boolean = false;

  constructor(
    private getChatRoomsListGql: GetChatRoomsListGQL,
    private globalChatSocketService: GlobalChatSocketService,
    private getChatRoomGql: GetChatRoomGQL,
    private session: Session,
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
  public refetch(initialized = false): void {
    this._initialized$.next(initialized);
    this.queryRef.refetch();
  }

  /**
   * Sets whether the chat room list is being viewed.
   * @param { boolean } value - whether the chat room list is being viewed.
   * @returns { void }
   */
  public setIsViewingChatRoomList(value: boolean): void {
    this.isViewingChatRoomsList = value;
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
        fetchPolicy: 'network-only',
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
          catchError((e) => {
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
              this._edges$.next([]);
              return;
            }

            this._edges$.next(
              result?.data?.chatRoomList?.edges as ChatRoomEdge[]
            );
            this._pageInfo$.next(result?.data?.chatRoomList?.pageInfo);
          } catch (e) {
            this.handleError(e);
          }
        }),
      this.globalChatSocketService.globalEvents$.subscribe(
        (event: ChatRoomEvent): void => {
          if (
            !event.data ||
            ![
              ChatRoomEventType.NewMessage,
              ChatRoomEventType.MessageDeleted,
            ].includes(event.data['type']) ||
            !event.roomGuid ||
            !this.session.isLoggedIn() ||
            !this.isViewingChatRoomsList
          ) {
            return;
          }

          // reload the room asynchronously and update cached value.
          this.reloadSingleRoom(event.roomGuid);
        }
      )
    );
  }

  /**
   * Reloads a single room and updates value in cache.
   * @param { string } roomGuid - the room guid to reload.
   * @returns { Promise<ChatRoomEdge> } - the chat room edge.
   */
  private async reloadSingleRoom(roomGuid: string): Promise<ChatRoomEdge> {
    try {
      const result: ApolloQueryResult<GetChatRoomQuery> = await lastValueFrom(
        this.getChatRoomGql.fetch(
          {
            roomGuid: roomGuid,
            firstMembers: 12,
            afterMembers: 0,
          },
          { fetchPolicy: 'network-only' }
        )
      );

      if (result?.errors?.length) {
        throw new Error(result.errors[0].message);
      }

      if (!result?.data?.chatRoom) {
        throw new Error('Chat room not found');
      }

      return result?.data?.chatRoom as ChatRoomEdge;
    } catch (e) {
      console.error(e);
    }
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
