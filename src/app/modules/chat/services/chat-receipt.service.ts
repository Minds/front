import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, map } from 'rxjs';
import {
  GetChatUnreadCountGQL,
  SetReadReceiptGQL,
} from '../../../../graphql/generated.engine';

@Injectable({ providedIn: 'root' })
export class ChatReceiptService {
  constructor(
    private setReadReceiptGql: SetReadReceiptGQL,
    private getUnreadCountGql: GetChatUnreadCountGQL
  ) {}

  /**
   * Poll for the unread message count
   * A temporary solution until we have websockets
   */
  getUnreadCount$(): Observable<number> {
    return this.getUnreadCountGql
      .watch(
        {},
        {
          pollInterval: 30 * 1000, // Every 30 seconds
        }
      )
      .valueChanges.pipe(map(({ data }) => data.chatUnreadMessagesCount));
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

    return !!result.data.readReceipt;
  }
}
