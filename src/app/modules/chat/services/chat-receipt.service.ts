import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, lastValueFrom } from 'rxjs';
import {
  ChatMessageNode,
  GetChatRoomsListDocument,
  GetChatRoomsListQuery,
  InitChatDocument,
  InitChatQuery,
  SetReadReceiptGQL,
} from '../../../../graphql/generated.engine';
import {
  ChatRoomEvent,
  ChatRoomEventType,
  GlobalChatSocketService,
} from './global-chat-socket.service';
import { Session } from '../../../services/session';
import { Apollo } from 'apollo-angular';
import { cloneDeep } from '@apollo/client/utilities';
import { PAGE_SIZE } from './chat-rooms-list.service';
import { ChatInitService } from './chat-init.service';

/**
 * Service to handle read receipts in chat.
 */
@Injectable({ providedIn: 'root' })
export class ChatReceiptService implements OnDestroy {
  /** Subscription to socket events. */
  private socketEventSubscription: Subscription;

  /** Unread message count */
  public readonly unreadCount$: Observable<number> =
    this.chatInitService.getUnreadCount$();

  constructor(
    private setReadReceiptGql: SetReadReceiptGQL,
    private chatInitService: ChatInitService,
    private globalChatSocketService: GlobalChatSocketService,
    private apollo: Apollo,
    private session: Session
  ) {
    this.initSocketSubscription();
  }

  ngOnDestroy(): void {
    this.socketEventSubscription?.unsubscribe();
  }

  /**
   * Updates the read receipt of a room
   * This mutation will then update the cache of the read list.
   * @returns { Promise<boolean> } - the result of the mutation.
   */
  async update(message: ChatMessageNode): Promise<boolean> {
    let success = true;

    if (message.sender.node.guid !== this.session.getLoggedInUser().guid) {
      const result = await lastValueFrom(
        this.setReadReceiptGql.mutate({
          roomGuid: message.roomGuid,
          messageGuid: message.guid,
        })
      );
      success = !!result.data.readReceipt;
    }

    this.chatInitService.refetch();
    this.incrementRoomUnreadCountCache(
      message.roomGuid,
      0,
      parseInt(message.timeCreatedUnix)
    );

    return success;
  }

  /**
   * Updates the rooms list cache to increment unread message counts.
   * @param { string } roomGuid - the room guid to update.
   */
  private incrementRoomUnreadCountCache(
    roomGuid: string,
    incrementBy: number = 1,
    lastMessageCreatedTimestamp: number = undefined
  ): void {
    let newValue: GetChatRoomsListQuery = cloneDeep(
      this.apollo.client.readQuery<GetChatRoomsListQuery>({
        query: GetChatRoomsListDocument,
        variables: {
          first: PAGE_SIZE,
        },
      })
    );

    if (!newValue) return;

    newValue.chatRoomList.edges.map((edge) => {
      if (edge.node.guid === roomGuid) {
        edge.unreadMessagesCount += incrementBy;
        if (lastMessageCreatedTimestamp) {
          edge.lastMessageCreatedTimestamp = lastMessageCreatedTimestamp;
        }
      }
    });

    newValue.chatRoomList.edges = newValue.chatRoomList.edges.sort(
      (a, b) => b.lastMessageCreatedTimestamp - a.lastMessageCreatedTimestamp
    );

    this.apollo.client.writeQuery({
      query: GetChatRoomsListDocument,
      variables: {
        first: PAGE_SIZE,
      },
      data: newValue,
    });
  }

  /**
   * Updates the rooms list cache to update unread message counts.
   * @param { string } roomGuid - the room guid to update.
   */
  private incrementGlobalUnreadCountCache(incrementBy: number = 1): void {
    let newValue: InitChatQuery = cloneDeep(
      this.apollo.client.readQuery<InitChatQuery>({
        query: InitChatDocument,
      })
    );

    if (!newValue) return;

    newValue.chatUnreadMessagesCount += incrementBy;

    this.apollo.client.writeQuery({
      query: InitChatDocument,
      data: newValue,
    });
  }

  /**
   * Initializes the socket subscription to listen for new messages.
   * @returns { void }
   */
  private initSocketSubscription(): void {
    this.socketEventSubscription =
      this.globalChatSocketService.globalEvents$.subscribe(
        (event: ChatRoomEvent): void => {
          if (
            !event.data ||
            event.data['type'] !== ChatRoomEventType.NewMessage
          ) {
            return;
          }

          const senderGuid: number = event.data?.['metadata']?.['senderGuid'];
          const loggedInUserGuid: number = Number(
            this.session.getLoggedInUser()?.guid
          );

          if (!loggedInUserGuid) {
            return;
          }

          if (senderGuid !== loggedInUserGuid) {
            this.incrementGlobalUnreadCountCache();
            this.incrementRoomUnreadCountCache(event.roomGuid);
          }
        }
      );
  }
}
