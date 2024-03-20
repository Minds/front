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
  GetChatMessagesGQL,
  GetChatMessagesQuery,
  GetChatMessagesQueryVariables,
  PageInfo,
} from '../../../../graphql/generated.engine';
import { MutationResult, QueryRef } from 'apollo-angular';
import { ToasterService } from '../../../common/services/toaster.service';
import { ApolloQueryResult } from '@apollo/client';
import { Router } from '@angular/router';

/** Size of an individual page. */
const PAGE_SIZE: number = 24;

@Injectable()
export class ChatMessagesService extends AbstractSubscriberComponent {
  /** Whether request is in progress. */
  private readonly _inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  /** Exposed observable to track whether a request is in progress. */
  public readonly inProgress$: Observable<
    boolean
  > = this._inProgress$.asObservable();

  /** Whether the service has been initialized. */
  private readonly _initialized$: Subject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /** Exposed observable to track whether the service has been initialized. */
  public readonly initialized$: Observable<
    boolean
  > = this._initialized$.asObservable();

  /** Page info for the chat messages. */
  private readonly _pageInfo$: BehaviorSubject<PageInfo> = new BehaviorSubject<
    PageInfo
  >(null);

  /** Exposed observable to track the page info for the chat messages. */
  public readonly pageInfo$: Observable<
    PageInfo
  > = this._pageInfo$.asObservable();

  /** Edges for the chat messages. */
  private readonly _edges$: BehaviorSubject<
    ChatMessageEdge[]
  > = new BehaviorSubject<ChatMessageEdge[]>([]);

  /** Exposed observable to track the edges for the chat messages. */
  public readonly edges$: Observable<
    ChatMessageEdge[]
  > = this._edges$.asObservable();

  /** Reference to the query. */
  private queryRef: QueryRef<
    GetChatMessagesQuery,
    GetChatMessagesQueryVariables
  >;

  private _chatMessageAppended$: Subject<boolean> = new Subject<boolean>();

  public chatMessageAppended$: Observable<
    boolean
  > = this._chatMessageAppended$.asObservable();

  constructor(
    private getChatMessagesGql: GetChatMessagesGQL,
    private deleteChatMessage: DeleteChatMessageGQL,
    private toaster: ToasterService,
    private router: Router
  ) {
    super();
  }

  /**
   * Initializes the service with the given parameters.
   * @returns { void }
   */
  public init(roomGuid: string): void {
    this.initQueryRef(roomGuid);
    this.subscribeToValueChanges();
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
              this._edges$.next([]);
              console.info('No chat rooms found');
              return;
            }
            this._edges$.next(
              result?.data?.chatMessages?.edges as ChatMessageEdge[]
            );
            this._pageInfo$.next(result?.data?.chatMessages?.pageInfo);
            this._inProgress$.next(false);
            this._initialized$.next(true);
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
    this.router.navigateByUrl('/chat/rooms');
  }

  /**
   * Append a message to chat messages.
   * @param { ChatMessageEdge } chatMessageEdge - The chat message edge to append.
   * @returns { void }
   */
  public appendChatMessage(chatMessageEdge: ChatMessageEdge): void {
    this._edges$.next([...this._edges$.getValue(), chatMessageEdge]);
    this._chatMessageAppended$.next(true);
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
      const response: MutationResult<DeleteChatMessageMutation> = await lastValueFrom(
        this.deleteChatMessage.mutate({
          messageGuid: chatMessageEdge.node.guid,
          roomGuid: chatMessageEdge.node.roomGuid,
        })
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
}
