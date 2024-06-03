import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  map,
  of,
} from 'rxjs';
import {
  ChatRoomEdge,
  GetChatRoomGQL,
  GetChatRoomQuery,
  GetChatRoomQueryVariables,
} from '../../../../graphql/generated.engine';
import { ToasterService } from '../../../common/services/toaster.service';
import { ApolloQueryResult } from '@apollo/client';
import { QueryRef } from 'apollo-angular';

/**
 * Service for management of data for a single chat room.
 */
@Injectable()
export class SingleChatRoomService implements OnDestroy {
  /** Chat room. */
  private _chatRoom$: BehaviorSubject<ChatRoomEdge> =
    new BehaviorSubject<ChatRoomEdge>(null);

  /** Chat room observable. */
  public chatRoom$: Observable<ChatRoomEdge> = this._chatRoom$.asObservable();

  /** Query reference. */
  private queryRef: QueryRef<GetChatRoomQuery, GetChatRoomQueryVariables>;

  /** Subscription to value changes. */
  private valueChangeSubscription: Subscription;

  constructor(
    private getChatRoomGql: GetChatRoomGQL,
    private toaster: ToasterService
  ) {}

  ngOnDestroy(): void {
    this.valueChangeSubscription?.unsubscribe();
  }

  /**
   * Inits service for given room GUID.
   * @param { string } roomGuid - The GUID of the chat room.
   * @returns { void }
   */
  public init(roomGuid: string): void {
    this.valueChangeSubscription?.unsubscribe();

    this.queryRef = this.getChatRoomGql.watch({
      roomGuid: roomGuid,
      firstMembers: 12,
      afterMembers: 0,
    });

    this.valueChangeSubscription = this.queryRef.valueChanges
      .pipe(
        catchError((e: Error): Observable<null> => {
          this.toaster.error(e);
          console.error(e);
          return of(null);
        }),
        map((result: ApolloQueryResult<GetChatRoomQuery>): ChatRoomEdge => {
          return (result?.data?.chatRoom as ChatRoomEdge) ?? null;
        })
      )
      .subscribe((chatRoom: ChatRoomEdge): void => {
        this._chatRoom$.next(chatRoom);
      });
  }

  /**
   * Refetch the chat room data.
   * @returns { void }
   */
  public refetch(): void {
    this.queryRef.refetch();
  }
}
