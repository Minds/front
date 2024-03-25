import { Injectable } from '@angular/core';
import {
  GetTotalChatRoomMembersGQL,
  GetTotalChatRoomMembersQuery,
} from '../../../../graphql/generated.engine';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';

/**
 * Service for getting a count of a chat rooms total members.
 */
@Injectable()
export class TotalChatRoomMembersService {
  /** Subject to reload count. */
  private readonly reload$: BehaviorSubject<void> = new BehaviorSubject<void>(
    null
  );

  /** Subject to hold the guid of the chat room. */
  private readonly roomGuid$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >(null);

  /**
   * Observable that represents the total number of members in the chat room.
   * Will fetch from server.
   */
  public readonly membersCount$ = combineLatest([
    this.reload$,
    this.roomGuid$,
  ]).pipe(
    switchMap(([_, roomGuid]: [void, string]) =>
      this.getTotalChatRoomMembersGQL.fetch(
        {
          roomGuid,
        },
        {
          fetchPolicy: 'network-only',
        }
      )
    ),
    map(
      (result: ApolloQueryResult<GetTotalChatRoomMembersQuery>): number =>
        result?.data?.chatRoom?.totalMembers ?? 0
    ),
    catchError((e: unknown) => {
      console.error(e);
      return of(0);
    }),
    shareReplay()
  );

  constructor(private getTotalChatRoomMembersGQL: GetTotalChatRoomMembersGQL) {}

  /**
   * Set the guid of the chat room.
   * @param { string } roomGuid - guid of the chat room.
   * @returns { void }
   */
  public setRoomGuid(roomGuid: string): void {
    this.roomGuid$.next(roomGuid);
  }

  /**
   * Reload the count of the chat room members.
   * @returns { void }
   */
  public reload(): void {
    this.reload$.next();
  }
}
