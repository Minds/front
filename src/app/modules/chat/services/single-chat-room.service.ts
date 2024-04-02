import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import {
  ChatRoomEdge,
  GetChatRoomGQL,
  GetChatRoomQuery,
} from '../../../../graphql/generated.engine';
import { ToasterService } from '../../../common/services/toaster.service';
import { ApolloQueryResult } from '@apollo/client';

/**
 * Service for management of data for a single chat room.
 */
@Injectable()
export class SingleChatRoomService {
  /** Internal subject to hold the guid of the chat room. */
  private readonly _roomGuid$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >(null);

  /** Internal subject to hold the guid of the chat room. */
  public readonly roomGuid$: Observable<
    string
  > = this._roomGuid$.asObservable();

  /** Exposed observable that represents the chat room. - pulls data from server and shares replay. */
  public readonly chatRoom$: Observable<ChatRoomEdge> = this._roomGuid$.pipe(
    startWith(null),
    filter(Boolean),
    switchMap(
      (roomGuid: string): Observable<ApolloQueryResult<GetChatRoomQuery>> =>
        this.getChatRoomGql.fetch(
          {
            roomGuid: roomGuid,
            firstMembers: 12,
            afterMembers: 0,
          },
          { fetchPolicy: 'no-cache' }
        )
    ),
    map(
      (result: ApolloQueryResult<GetChatRoomQuery>): ChatRoomEdge => {
        return (result?.data?.chatRoom as ChatRoomEdge) ?? null;
      }
    ),
    catchError(
      (e: Error): Observable<null> => {
        this.toaster.error(e);
        console.error(e);
        return of(null);
      }
    ),
    shareReplay()
  );

  constructor(
    private getChatRoomGql: GetChatRoomGQL,
    private toaster: ToasterService
  ) {}

  /**
   * Set the room GUID of the service for loading data.
   * @param { string } roomGuid - The GUID of the chat room.
   * @returns { void }
   */
  public setRoomGuid(roomGuid: string): void {
    this._roomGuid$.next(roomGuid);
  }

  /**
   * Refetch the chat room data.
   * @returns { void }
   */
  public refetch(): void {
    this._roomGuid$.next(this._roomGuid$.getValue());
  }
}
