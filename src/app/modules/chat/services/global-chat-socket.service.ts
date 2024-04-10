import { Injectable, OnDestroy } from '@angular/core';
import { SocketsService } from '../../../services/sockets';
import {
  Observable,
  Subject,
  Subscription,
  filter,
  firstValueFrom,
} from 'rxjs';

/** Prefix for chat room names. */
export const CHAT_ROOM_NAME_PREFIX: string = 'chat:';

/** Chat room event. */
export type ChatRoomEvent = {
  roomGuid: string;
  data: Object;
};

/**
 * Service to handle global chat socket events.
 */
@Injectable({ providedIn: 'root' })
export class GlobalChatSocketService implements OnDestroy {
  /** Subject for global chat events. */
  public readonly globalEvents$: Subject<ChatRoomEvent> =
    new Subject<ChatRoomEvent>();

  /** Map of room names to subscriptions. */
  private readonly roomMap: Map<string, Subscription> = new Map<
    string,
    Subscription
  >();

  constructor(private sockets: SocketsService) {}

  ngOnDestroy(): void {
    this.leaveAllRooms();
  }

  /**
   * Listen to room GUIDs.
   * @param { string[] } roomGuids - the room GUIDs to listen to.
   * @returns { Promise<void> }
   */
  public async listenToRoomGuids(roomGuids: string[]): Promise<void> {
    await firstValueFrom(this.sockets.onReady$);

    for (let roomGuid of roomGuids) {
      this.joinRoom(CHAT_ROOM_NAME_PREFIX + roomGuid);
    }
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
   * Join a room.
   * @param { string } roomName - the room name to join.
   * @returns { void }
   */
  private joinRoom(roomName: string): void {
    if (Boolean(this.roomMap.get(roomName))) {
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
   * Leave a room.
   * @param { string } roomName - the room name to leave.
   * @returns { void }
   */
  private leaveRoom(roomName: string): void {
    this.roomMap.get(roomName)?.unsubscribe();
    this.roomMap.delete(roomName);
    this.sockets.leave(roomName);
  }
}
