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

/** Prefix for chat room names. */
export const CHAT_ROOM_LIST_EVENT: string = 'chat_rooms';

/** Chat room event. */
export type ChatRoomEvent = {
  roomGuid: string;
  data: Object;
};

/** Chat room event types */
export enum ChatRoomEventType {
  NewMessage = 'NEW_MESSAGE',
  MessageDeleted = 'MESSAGE_DELETED',
}

/**
 * Service to handle global chat socket events.
 */
@Injectable({ providedIn: 'root' })
export class GlobalChatSocketService {
  /** Subject for global chat events. */
  public readonly globalEvents$: Subject<ChatRoomEvent> =
    new Subject<ChatRoomEvent>();

  /** A list of rooms that the socket server is listening to */
  public roomGuids: string[] = [];

  /** A listener thhat maps socket events to chat globalEvents$ */
  private readonly catchAllSocketEvents = (eventName, ...args) => {
    if (eventName === CHAT_ROOM_LIST_EVENT) {
      // Keep a refresh so we can refresh at a later date
      this.roomGuids = args[0];
    }

    if (eventName.indexOf(CHAT_ROOM_NAME_PREFIX) > -1) {
      this.globalEvents$.next({
        roomGuid: eventName.replace(CHAT_ROOM_NAME_PREFIX, ''),
        data: JSON.parse(args[0]),
      });
    }
  };

  constructor(private sockets: SocketsService) {}

  /**
   * Proxies all socket events and filters out chat room events
   * @returns { Promise<void> }
   */
  public async listen(): Promise<void> {
    await firstValueFrom(this.sockets.onReady$);

    this.sockets.socket.offAny(this.catchAllSocketEvents);
    this.sockets.socket.onAny(this.catchAllSocketEvents);
  }

  /**
   * Get events by chat room GUID.
   * @param { string } guid - the chat room GUID.
   * @returns { Observable<ChatRoomEvent> } - the chat room event.
   */
  public getEventsByChatRoomGuid(guid: string): Observable<ChatRoomEvent> {
    if (this.sockets.socket && this.roomGuids.indexOf(guid) < 0) {
      // Refresh the socket server room subscrioptions
      this.sockets.emit('chat_refresh_rooms');
    }

    return this.globalEvents$.pipe(
      filter((event: ChatRoomEvent) => event.roomGuid === guid)
    );
  }
}
