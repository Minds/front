import { Injectable } from '@angular/core';
import {
  ChatRoomEdge,
  CreateGroupChatRoomGQL,
  CreateGroupChatRoomMutation,
  DeleteGroupChatRoomsGQL,
  DeleteGroupChatRoomsMutation,
} from '../../../../../graphql/generated.engine';
import { lastValueFrom } from 'rxjs';
import { MutationResult } from 'apollo-angular';

const DEFAULT_CHAT_CREATE_ERROR: string =
  'An error occurred while creating chat';
const DEFAULT_CHAT_DELETE_ERROR: string =
  'An error occurred while deleting chat';

/**
 * Service for handling creation and deletion of group chat rooms.
 */
@Injectable({ providedIn: 'root' })
export class GroupChatRoomService {
  constructor(
    private createGroupChatRoomGQL: CreateGroupChatRoomGQL,
    private deleteGroupChatRoomsGQL: DeleteGroupChatRoomsGQL
  ) {}

  /**
   * Deletes all chat rooms for a group.
   * @param { string } groupGuid - Group GUID.
   * @returns { Promise<boolean> } - Whether the groups chat rooms were deleted.
   */
  public async deleteGroupChatRooms(groupGuid: string): Promise<boolean> {
    const response: MutationResult<DeleteGroupChatRoomsMutation> =
      await lastValueFrom(this.deleteGroupChatRoomsGQL.mutate({ groupGuid }));

    if (response?.errors?.length) {
      throw new Error(
        response?.errors?.[0]?.message ?? DEFAULT_CHAT_DELETE_ERROR
      );
    }

    if (!response?.data?.deleteGroupChatRooms) {
      throw new Error(DEFAULT_CHAT_DELETE_ERROR);
    }

    return response.data.deleteGroupChatRooms;
  }

  /**
   * Creates a chat room for a group.
   * @param { string } groupGuid - Group GUID.
   * @returns { Promise<ChatRoomEdge> } - The created chat room.
   */
  public async createGroupChatRoom(groupGuid: string): Promise<ChatRoomEdge> {
    const response: MutationResult<CreateGroupChatRoomMutation> =
      await lastValueFrom(this.createGroupChatRoomGQL.mutate({ groupGuid }));

    if (response.errors?.length) {
      throw new Error(response.errors[0]?.message ?? DEFAULT_CHAT_CREATE_ERROR);
    }

    if (!response?.data?.createGroupChatRoom) {
      throw new Error(DEFAULT_CHAT_CREATE_ERROR);
    }

    return response.data.createGroupChatRoom as ChatRoomEdge;
  }
}
