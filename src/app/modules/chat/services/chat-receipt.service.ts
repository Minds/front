import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, lastValueFrom, map, of } from 'rxjs';
import {
  GetChatRoomsListDocument,
  GetChatRoomsListQuery,
  GetChatUnreadCountGQL,
  GetChatUnreadCountQuery,
  SetReadReceiptGQL,
} from '../../../../graphql/generated.engine';
import {
  ChatRoomEvent,
  GlobalChatSocketService,
} from './global-chat-socket.service';
import { Session } from '../../../services/session';
import { Apollo, QueryRef } from 'apollo-angular';
import { cloneDeep } from '@apollo/client/utilities';
import { PAGE_SIZE } from './chat-rooms-list.service';

@Injectable({ providedIn: 'root' })
export class ChatReceiptService implements OnDestroy {
  private socketEventSubscription: Subscription;

  private _queryRef: QueryRef<GetChatUnreadCountQuery>;

  constructor(
    private setReadReceiptGql: SetReadReceiptGQL,
    private getUnreadCountGql: GetChatUnreadCountGQL,
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
   * Get initial unread message count and poll for future updates..
   * @returns { Observable<number> } - the unread message count.
   */
  public getUnreadCount$(): Observable<number> {
    if (!this.session.isLoggedIn()) {
      return of(null);
    }
    return this.getQueryRef().valueChanges.pipe(
      map(({ data }) => data.chatUnreadMessagesCount)
    );
  }

  /**
   * Updates the read receipt of a room
   * This mutation will then update the cache of the read list
   */
  async update(roomGuid: string, messageGuid: string): Promise<boolean> {
    const result = await lastValueFrom(
      this.setReadReceiptGql.mutate({
        roomGuid: roomGuid,
        messageGuid: messageGuid,
      })
    );

    this.getQueryRef().refetch();

    return !!result.data.readReceipt;
  }

  /**
   * Gets the query reference or instantiates a new one.
   * @returns { QueryRef<GetChatUnreadCountQuery> } - the query reference.
   */
  private getQueryRef(): QueryRef<GetChatUnreadCountQuery> {
    if (!this._queryRef) {
      this._queryRef = this.getUnreadCountGql.watch();
    }
    return this._queryRef;
  }

  /**
   * Updates the rooms list cache to update unread message counts.
   * @param { string } roomGuid - the room guid to update.
   */
  private updateRoomsListCache(roomGuid: string): void {
    let newValue: GetChatRoomsListQuery = cloneDeep(
      this.apollo.client.readQuery<GetChatRoomsListQuery>({
        query: GetChatRoomsListDocument,
        variables: {
          first: 24,
        },
      })
    );

    newValue.chatRoomList.edges.map(edge => {
      if (edge.node.guid === roomGuid) {
        edge.unreadMessagesCount += 1;
      }
    });

    this.apollo.client.writeQuery({
      query: GetChatRoomsListDocument,
      variables: {
        first: PAGE_SIZE,
      },
      data: newValue,
    });
  }

  /**
   * Initializes the socket subscription to listen for new messages.
   * @returns { void }
   */
  private initSocketSubscription(): void {
    this.socketEventSubscription = this.globalChatSocketService.globalEvents$.subscribe(
      (event: ChatRoomEvent): void => {
        if (!event.data || event['type'] !== 'NEW_MESSAGE') {
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
          this.getQueryRef().refetch();
          this.updateRoomsListCache(event.roomGuid);
        }
      }
    );
  }
}
