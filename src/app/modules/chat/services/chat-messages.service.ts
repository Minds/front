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
  ChatMessageEdge,
  DeleteChatMessageGQL,
  DeleteChatMessageMutation,
  GetChatMessagesDocument,
  GetChatMessagesGQL,
  GetChatMessagesQuery,
  GetChatMessagesQueryVariables,
  PageInfo,
} from '../../../../graphql/generated.engine';
import { Apollo, MutationResult, QueryRef } from 'apollo-angular';
import { ToasterService } from '../../../common/services/toaster.service';
import { ApolloQueryResult, InMemoryCache } from '@apollo/client';
import { Router } from '@angular/router';
import {
  ChatRoomEvent,
  GlobalChatSocketService,
} from './global-chat-socket.service';
import { Session } from '../../../services/session';
import { cloneDeep } from '@apollo/client/utilities';
import * as _ from 'lodash';
import { isEqual } from 'lodash';

/** Size of an individual page. */
export const PAGE_SIZE: number = 24;

@Injectable()
export class ChatMessagesService extends AbstractSubscriberComponent {
  /** Whether request is in progress. */
  private readonly _inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /** Exposed observable to track whether a request is in progress. */
  public readonly inProgress$: Observable<boolean> =
    this._inProgress$.asObservable();

  /** Whether request to fetch new is in progress. */
  private readonly _fetchNewInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Exposed observable to track whether a request to fetch new is in progress. */
  public readonly fetchNewInProgress$: Observable<boolean> =
    this._fetchNewInProgress$.asObservable();

  /** Whether the service has been initialized. */
  private readonly _initialized$: Subject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Exposed observable to track whether the service has been initialized. */
  public readonly initialized$: Observable<boolean> =
    this._initialized$.asObservable();

  /** Page info for the chat messages. */
  private readonly _pageInfo$: BehaviorSubject<PageInfo> =
    new BehaviorSubject<PageInfo>(null);

  /** Exposed observable to track the page info for the chat messages. */
  public readonly pageInfo$: Observable<PageInfo> =
    this._pageInfo$.asObservable();

  /** Edges for the chat messages. */
  private readonly _edges$: BehaviorSubject<ChatMessageEdge[]> =
    new BehaviorSubject<ChatMessageEdge[]>([]);

  /** Exposed observable to track the edges for the chat messages. */
  public readonly edges$: Observable<ChatMessageEdge[]> =
    this._edges$.asObservable();

  /** Reference to the query. */
  private queryRef: QueryRef<
    GetChatMessagesQuery,
    GetChatMessagesQueryVariables
  >;

  /** Subject to request that listening components scroll to bottom. */
  private readonly _scrollToBottom$: Subject<boolean> = new Subject<boolean>();

  /** Observable to request that listening components scroll to bottom. */
  public readonly scrollToBottom$: Observable<boolean> =
    this._scrollToBottom$.asObservable();

  /** Updated when there is a new message to load. */
  public readonly hasNewMessage$: Subject<void> = new Subject<void>();

  /** The end cursor for the query. */
  private endCursor: string;

  constructor(
    private getChatMessagesGql: GetChatMessagesGQL,
    private deleteChatMessage: DeleteChatMessageGQL,
    private globalChatSocketService: GlobalChatSocketService,
    private apollo: Apollo,
    private toaster: ToasterService,
    private router: Router,
    private session: Session
  ) {
    super();
  }

  /**
   * Initializes the service with the given parameters.
   * @returns { void }
   */
  public init(roomGuid: string): void {
    this.initQueryRef(roomGuid);
    this.setupSubscriptions(roomGuid);
  }

  /**
   * Fetches more data for the table.
   * @returns { void }
   */
  public fetchMore(): void {
    this._inProgress$.next(true);

    this.subscriptions.push(
      this.pageInfo$.pipe(take(1)).subscribe((pageInfo: PageInfo): void => {
        this.queryRef.fetchMore({
          variables: {
            before: pageInfo.startCursor,
          },
        });
      })
    );
  }

  /**
   * Fetches new messages. Will manually patch values into the cache such that
   * it can be handled properly by the value change listener.
   * @returns { void }
   */
  public fetchNew(): void {
    this._fetchNewInProgress$.next(true);

    this.queryRef.subscribeToMore({
      document: GetChatMessagesDocument,
      variables: {
        roomGuid: this.queryRef.variables.roomGuid,
        after: this.endCursor,
        first: PAGE_SIZE,
      },
      updateQuery: this.updateCacheWithNewMessage.bind(this),
    });
  }

  /**
   * Initializes the query reference.
   * @returns { void }
   */
  private initQueryRef(roomGuid: string): void {
    this.queryRef = this.getChatMessagesGql.watch(
      {
        roomGuid: roomGuid,
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
   * @param { string } roomGuid - The room guid to subscribe to.
   * @returns { void }
   */
  private setupSubscriptions(roomGuid: string): void {
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
            this._inProgress$.next(false);
            this._initialized$.next(true);
            return of(null);
          })
        )
        .subscribe((result: ApolloQueryResult<GetChatMessagesQuery>): void => {
          try {
            if (!result || result.loading) {
              return;
            }

            if (result?.errors?.length) {
              throw new Error(result.errors[0].message);
            }

            if (!result || !result?.data?.chatMessages?.edges?.length) {
              this._inProgress$.next(false);
              this._initialized$.next(true);
              console.info('No chat rooms found');
              return;
            }
            this._edges$.next(
              result?.data?.chatMessages?.edges as ChatMessageEdge[]
            );
            this._pageInfo$.next(result?.data?.chatMessages?.pageInfo);

            // we want to keep track of the end cursor for fetching new messages.
            this.endCursor =
              result?.data?.chatMessages?.edges[
                result?.data?.chatMessages?.edges.length - 1
              ].cursor;

            this._inProgress$.next(false);
            this._initialized$.next(true);

            if (this._fetchNewInProgress$.getValue()) {
              this._fetchNewInProgress$.next(false);
              this.requestScrollToBottom();
            }
          } catch (e) {
            this.handleError(e);
          }
        }),
      this.globalChatSocketService
        .getEventsByChatRoomGuid(roomGuid)
        .subscribe((event: ChatRoomEvent): void => {
          switch (event?.data?.['type']) {
            case 'NEW_MESSAGE':
              this.handleNewMessageSocketEvent(event);
              break;
            case 'MESSAGE_DELETED':
              this.handleMessageDeletionSocketEvent(event);
              break;
            default:
              console.warn('Unhandled chat room event', event);
              break;
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
    this.router.navigateByUrl('/chat/rooms');
  }

  /**
   * Append a message to chat messages.
   * @param { ChatMessageEdge } chatMessageEdge - The chat message edge to append.
   * @returns { void }
   */
  public requestScrollToBottom(): void {
    this._scrollToBottom$.next(true);
  }

  /**
   * Append a message to chat messages.
   * @param { ChatMessageEdge } chatMessageEdge - The chat message edge to append.
   * @returns { Promise<void> }
   */
  public async removeChatMessage(
    chatMessageEdge: ChatMessageEdge
  ): Promise<boolean> {
    try {
      const response: MutationResult<DeleteChatMessageMutation> =
        await lastValueFrom(
          this.deleteChatMessage.mutate(
            {
              messageGuid: chatMessageEdge.node.guid,
              roomGuid: chatMessageEdge.node.roomGuid,
            },
            {
              update: this.handleMessageDeletionUpdate.bind(this),
            }
          )
        );

      if (response?.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      if (!response.data.deleteChatMessage) {
        throw new Error('Failed to delete message');
      }

      this._edges$.next(
        this._edges$.getValue().filter((edge: ChatMessageEdge): boolean => {
          return edge.node.id !== chatMessageEdge.node.id;
        })
      );

      this.toaster.success('Message deleted');
      return true;
    } catch (e) {
      console.error(e);
      this.toaster.error(e?.message);
      return false;
    }
  }

  /**
   * Check if there is a next page.
   * @returns { boolean } - true if there is a next page.
   */
  public hasNextPage(): boolean {
    return this._pageInfo$.getValue()?.hasNextPage;
  }

  /**
   * Update the Apollo cache with a new message.
   * @param { GetChatMessagesQuery } prev - The previous query.
   * @param { ApolloQueryResult<GetChatMessagesQuery> } queryResult - containing subscription data.
   * @returns { GetChatMessagesQuery } - The updated query.
   */
  private updateCacheWithNewMessage(
    prev: GetChatMessagesQuery,
    {
      subscriptionData,
    }: { subscriptionData: ApolloQueryResult<GetChatMessagesQuery> }
  ): GetChatMessagesQuery {
    if (!subscriptionData.data) {
      return prev;
    }

    // deduplicate messages.
    let newEdges = subscriptionData.data.chatMessages.edges.filter(
      (edge: ChatMessageEdge) =>
        prev.chatMessages.edges.filter((prevEdge: ChatMessageEdge): boolean => {
          return prevEdge.id !== edge.id;
        }).length === prev.chatMessages.edges.length
    );

    let pageInfo: PageInfo = subscriptionData.data.chatMessages.pageInfo;

    /**
     * We need to patch edges to insert new edges, but also page data, as we are
     * changing the next page states, but don't want to change the previous page states.
     */
    return {
      chatMessages: {
        edges: [...prev.chatMessages.edges, ...newEdges],
        pageInfo: {
          hasNextPage: pageInfo.hasNextPage,
          hasPreviousPage: prev.chatMessages.pageInfo.hasPreviousPage,
          startCursor: prev.chatMessages.pageInfo.startCursor,
          endCursor: pageInfo.endCursor,
        },
      },
    };
  }

  /**
   * Handle message deletion mutation update.
   * @param { InMemoryCache } cache - The cache.
   * @param { MutationResult<DeleteChatMessageMutation> } result - The result of the mutation.
   * @param { any } options - The options.
   * @returns { void }
   */
  private handleMessageDeletionUpdate(
    cache: InMemoryCache,
    result: MutationResult<DeleteChatMessageMutation>,
    options: any
  ): void {
    if (!options?.variables?.messageGuid) {
      console.warn('No message guid found in options for deletion update');
      return;
    }
    this.handleMessageDeletion(options.variables.messageGuid.toString());
  }

  /**
   * Handle message deletion, updating the local cache to remove the entry.
   * @param { string } messageGuid - The message guid to remove.
   * @returns { void }
   */
  private handleMessageDeletion(messageGuid: string): void {
    let oldValue: GetChatMessagesQuery = cloneDeep(
      this.apollo.client.readQuery<GetChatMessagesQuery>({
        query: GetChatMessagesDocument,
        variables: {
          first: PAGE_SIZE,
          roomGuid: this.queryRef.variables.roomGuid,
        },
      })
    );
    let newValue = cloneDeep(oldValue);

    newValue.chatMessages.edges = newValue.chatMessages.edges.filter(
      (edge: ChatMessageEdge): boolean => edge.node.guid !== messageGuid
    );

    if (isEqual(newValue, oldValue)) {
      return; // no change, no need to update cache.
    }

    this.apollo.client.writeQuery({
      query: GetChatMessagesDocument,
      variables: {
        first: PAGE_SIZE,
        roomGuid: this.queryRef.variables.roomGuid,
      },
      data: newValue,
    });
  }

  /**
   * Handles a new message event.
   * @param { ChatRoomEvent } event - The event to handle.
   * @returns { void }
   */
  private handleNewMessageSocketEvent(event: ChatRoomEvent): void {
    // Skip our own messages.
    if (
      this.session.getLoggedInUser()?.guid ===
      event.data['metadata']['senderGuid']
    ) {
      return;
    }

    this._pageInfo$.next({
      ...this._pageInfo$.getValue(),
      hasNextPage: true,
    });

    this.hasNewMessage$.next();
  }

  /**
   * Handles a message deletion event.
   * @param { ChatRoomEvent } event - The event to handle.
   * @returns { void }
   */
  private handleMessageDeletionSocketEvent(event: ChatRoomEvent): void {
    if (!event.data?.['metadata']?.['messageGuid']) {
      console.warn('No message guid found in event data for deleted event');
      return;
    }

    this.handleMessageDeletion(event.data['metadata']['messageGuid']);
  }
}
