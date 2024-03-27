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
  ChatRoomMemberEdge,
  GetChatRoomMembersGQL,
  GetChatRoomMembersQuery,
  GetChatRoomMembersQueryVariables,
  PageInfo,
} from '../../../../graphql/generated.engine';
import { QueryRef } from 'apollo-angular';
import { ToasterService } from '../../../common/services/toaster.service';
import { ApolloQueryResult } from '@apollo/client';

/** Size of an individual page. */
const PAGE_SIZE: number = 24;

/**
 * Service for handling chat room members.
 */
@Injectable()
export class ChatRoomMembersService extends AbstractSubscriberComponent {
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

  /** Page info for the chat members. */
  private readonly _pageInfo$: BehaviorSubject<PageInfo> = new BehaviorSubject<
    PageInfo
  >(null);

  /** Exposed observable to track the page info for the chat members. */
  public readonly pageInfo$: Observable<
    PageInfo
  > = this._pageInfo$.asObservable();

  /** Edges for the chat members. */
  private readonly _edges$: BehaviorSubject<
    ChatRoomMemberEdge[]
  > = new BehaviorSubject<ChatRoomMemberEdge[]>([]);

  /** Exposed observable to track the edges for the chat members. */
  public readonly edges$: Observable<
    ChatRoomMemberEdge[]
  > = this._edges$.asObservable();

  /** Reference to the query. */
  private queryRef: QueryRef<
    GetChatRoomMembersQuery,
    GetChatRoomMembersQueryVariables
  >;

  constructor(
    private getChatRoomMembersGQL: GetChatRoomMembersGQL,
    private toaster: ToasterService
  ) {
    super();
  }

  /**
   * Initializes the service with the given parameters.
   * @returns { void }
   */
  public init(roomGuid: string, excludeSelf: boolean = false): void {
    this.initQueryRef(roomGuid, excludeSelf);
    this.subscribeToValueChanges();
  }

  /**
   * Fetches more data.
   * @returns { void }
   */
  public fetchMore(): void {
    this._inProgress$.next(true);

    this.subscriptions.push(
      this.pageInfo$.pipe(take(1)).subscribe((pageInfo: PageInfo): void => {
        this.queryRef.fetchMore({
          variables: {
            after: pageInfo.endCursor,
          },
        });
      })
    );
  }

  /**
   * Refetch.
   * @returns { void }
   */
  public refetch(): void {
    this._initialized$.next(false);
    this.queryRef.refetch();
  }

  /**
   * Initializes the query reference.
   * @returns { void }
   */
  private initQueryRef(roomGuid: string, excludeSelf: boolean = false): void {
    this.queryRef = this.getChatRoomMembersGQL.watch(
      {
        roomGuid: roomGuid,
        excludeSelf: excludeSelf,
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
        .subscribe(
          (result: ApolloQueryResult<GetChatRoomMembersQuery>): void => {
            try {
              if (!result || result.loading) {
                return;
              }

              if (result?.errors?.length) {
                throw new Error(result.errors[0].message);
              }

              if (!result || !result?.data?.chatRoomMembers?.edges?.length) {
                this._inProgress$.next(false);
                this._initialized$.next(true);
                console.info('No chat room members found');
                return;
              }
              this._edges$.next(
                result?.data?.chatRoomMembers?.edges as ChatRoomMemberEdge[]
              );
              this._pageInfo$.next(result?.data?.chatRoomMembers?.pageInfo);
              this._inProgress$.next(false);
              this._initialized$.next(true);
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
