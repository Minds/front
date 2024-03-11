import { Injectable } from '@angular/core';
import { ChatRoomMemberEdge } from '../../../../graphql/generated.engine';

/**
 * Service for handling chat room utilities.
 */
@Injectable({ providedIn: 'root' })
export class ChatRoomUtilsService {
  /**
   * Derive the room name from the members of the room.
   * @param { ChatRoomMemberEdge[] } members - The members of the chat room.
   * @returns { string } - The derived room name.
   */
  public deriveRoomNameFromMembers(members: ChatRoomMemberEdge[]): string {
    if (!members?.length) return 'Your chat';

    if (members.length === 1) {
      return members[0].node.name;
    }

    return `${members[0].node.name}, ${members[1].node.name}, and more`;
  }
}
