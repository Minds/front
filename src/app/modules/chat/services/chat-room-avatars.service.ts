import { Injectable } from '@angular/core';
import { ChatRoomMemberEdge } from '../../../../graphql/generated.engine';
import { MindsAvatarObject } from '../../../common/components/avatar/avatar';

/**
 * Extended MindsAvatarObject with added properties to keep templates tidy.
 */
export type ChatRoomListAvatarObject = {
  navigationPath: string;
  username?: string;
} & MindsAvatarObject;

/**
 * Service for getting chat room avatars for a chat room.
 */
@Injectable({ providedIn: 'root' })
export class ChatRoomAvatarsService {
  /**
   * Get the user avatar objects for the chat room.
   * @param { ChatRoomMemberEdge[] } members - The members of the chat room.
   * @param { number } maxAvatarCount - The maximum number of avatars to return.
   * @returns { ChatRoomListAvatarObject[] } - The avatar objects for the chat room.
   */
  public getUserAvatarObjects(
    members: ChatRoomMemberEdge[],
    maxAvatarCount: number = 3
  ): ChatRoomListAvatarObject[] {
    return (
      members?.slice(0, maxAvatarCount).map((member: ChatRoomMemberEdge) => {
        return {
          guid: member.node.guid,
          type: 'user',
          username: member.node.username,
          navigationPath: `/${member.node.username}`,
        };
      }) ?? []
    );
  }

  /**
   * Get the group avatar object for the chat room.
   * @param { string } groupGuid - The GUID of the group.
   * @returns { ChatRoomListAvatarObject[] } - The avatar object for the chat room.
   */
  public getGroupAvatarObjects(groupGuid: string): ChatRoomListAvatarObject[] {
    return [
      {
        guid: groupGuid,
        type: 'group',
        navigationPath: `/group/${groupGuid}/latest`,
      },
    ];
  }
}
