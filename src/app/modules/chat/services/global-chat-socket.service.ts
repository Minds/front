import { Injectable, OnDestroy } from '@angular/core';
import { SocketsService } from '../../../services/sockets';
import {
  GetChatRoomGuidsGQL,
  GetChatRoomGuidsQuery,
} from '../../../../graphql/generated.engine';
import {
  Observable,
  Subject,
  Subscription,
  filter,
  firstValueFrom,
} from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { QueryRef } from 'apollo-angular';
import { Session } from '../../../services/session';

/** Interval for chat polling - long time period to help keep things in sync. */
const CHAT_POLLING_INTERVAL = 600 * 1000; // 10m

/** Prefix for chat room names. */
const CHAT_ROOM_NAME_PREFIX: string = 'chat:';

/** Chat room event. */
export type ChatRoomEvent = {
  roomGuid: string;
  data: Object;
};

@Injectable({ providedIn: 'root' })
export class GlobalChatSocketService implements OnDestroy {
  /** Subject for global chat events. */
  public readonly globalEvents$: Subject<ChatRoomEvent> = new Subject<
    ChatRoomEvent
  >();

  /** Map of room names to subscriptions. */
  private readonly roomMap: Map<string, Subscription> = new Map<
    string,
    Subscription
  >();

  /** Reference to get room GUIDs query. */
  private getRoomGuidsQuery: QueryRef<GetChatRoomGuidsQuery>;

  /** Subscription to get room GUIDs query. */
  private getRoomGuidsSubscription: Subscription;

  constructor(
    private sockets: SocketsService,
    private getChatRoomGuidsGQL: GetChatRoomGuidsGQL,
    private session: Session
  ) {}

  ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * Set up the service.
   * @returns { Promise<void> }
   */
  public async setUp(): Promise<void> {
    if (!this.session.isLoggedIn()) {
      console.info('Skipping chat socket init as user is not logged in');
      return;
    }

    this.getRoomGuidsQuery = this.getChatRoomGuidsGQL.watch(
      {},
      {
        pollInterval: CHAT_POLLING_INTERVAL,
      }
    );

    this.getRoomGuidsSubscription = this.getRoomGuidsQuery.valueChanges.subscribe(
      (response: ApolloQueryResult<GetChatRoomGuidsQuery>): void => {
        this.listenToRoomGuids(response.data.chatRoomGuids);
      }
    );
  }

  /**
   * Destroy subscriptions and leave all rooms.
   * @returns { void }
   */
  public destroy(): void {
    this.getRoomGuidsSubscription?.unsubscribe();
    this.getRoomGuidsQuery.stopPolling();
    this.leaveAllRooms();
  }

  /**
   * Leave all rooms.
   * @returns { void }
   */
  public leaveAllRooms(): void {
    for (let roomName of this.roomMap.keys()) {
      this.leaveRoom(roomName);
    }
  }

  /**
   * Join a room.
   * @param { string } roomName - the room name to join.
   * @returns { void }
   */
  public joinRoom(roomName: string): void {
    if (Boolean(this.roomMap.get(roomName))) {
      console.info('Already joined room:', roomName);
      return;
    }

    this.sockets.join(roomName);
    this.roomMap.set(
      roomName,
      this.sockets.subscribe(roomName, (event: string) => {
        this.globalEvents$.next({
          roomGuid: roomName.replace(CHAT_ROOM_NAME_PREFIX, ''),
          data: JSON.parse(event),
        });
      })
    );
  }

  /**
   * Get events by chat room GUID.
   * @param { string } guid - the chat room GUID.
   * @returns { Observable<ChatRoomEvent> } - the chat room event.
   */
  public getEventsByChatRoomGuid(guid: string): Observable<ChatRoomEvent> {
    return this.globalEvents$.pipe(
      filter((event: ChatRoomEvent) => event.roomGuid === guid)
    );
  }

  /**
   * Leave a room.
   * @param { string } roomName - the room name to leave.
   * @returns { void }
   */
  public leaveRoom(roomName: string): void {
    this.roomMap.get(roomName)?.unsubscribe();
    this.roomMap.delete(roomName);
    this.sockets.leave(roomName);
  }

  /**
   * Listen to room GUIDs.
   * @param { string[] } roomGuids - the room GUIDs to listen to.
   * @returns { Promise<void> }
   */
  private async listenToRoomGuids(roomGuids: string[]): Promise<void> {
    await firstValueFrom(this.sockets.onReady$);

    for (let roomGuid of roomGuids) {
      this.joinRoom(CHAT_ROOM_NAME_PREFIX + roomGuid);
    }
  }
}
