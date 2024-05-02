import { Injectable } from '@angular/core';
import {
  ChatRoomEdge,
  DeleteChatRoomAndBlockUserGQL,
  DeleteChatRoomAndBlockUserMutation,
  DeleteChatRoomGQL,
  DeleteChatRoomMutation,
  DeleteGroupChatRoomsGQL,
  DeleteGroupChatRoomsMutation,
  LeaveChatRoomGQL,
  LeaveChatRoomMutation,
  RemoveMemberFromChatRoomGQL,
  RemoveMemberFromChatRoomMutation,
  UserNode,
} from '../../../../graphql/generated.engine';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { MutationResult } from 'apollo-angular';
import { ToasterService } from '../../../common/services/toaster.service';

/**
 * Service for handling various actions that can be performed against chat room members.
 */
@Injectable({ providedIn: 'root' })
export class ChatRoomUserActionsService {
  /** Whether an action is in progress. */
  private actionInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private deleteChatRoomGQL: DeleteChatRoomGQL,
    private leaveChatRoomGQL: LeaveChatRoomGQL,
    private removeMemberFromChatRoomGql: RemoveMemberFromChatRoomGQL,
    private deleteChatRoomAndBlockUserGQL: DeleteChatRoomAndBlockUserGQL,
    private deleteGroupChatRoomsGQL: DeleteGroupChatRoomsGQL,
    private toaster: ToasterService
  ) {}

  /**
   * Block user by chat room. (only used for one-to-one chats).
   * @param { ChatRoomEdge } chatRoom - Chat room to block user from.
   * @returns { Promise<boolean> } - Whether user was blocked.
   */
  public async blockUserByChatRoom(chatRoom: ChatRoomEdge): Promise<boolean> {
    if (this.actionInProgress$.getValue()) {
      return;
    }

    this.actionInProgress$.next(true);

    try {
      const response: MutationResult<DeleteChatRoomAndBlockUserMutation> =
        await lastValueFrom(
          this.deleteChatRoomAndBlockUserGQL.mutate({
            roomGuid: chatRoom.node.guid,
          })
        );

      if (response.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      if (!response.data.deleteChatRoomAndBlockUser) {
        throw new Error('Could not block user');
      }

      this.toaster.success('User blocked');
      return true;
    } catch (e) {
      this.toaster.error(e);
      return false;
    } finally {
      this.actionInProgress$.next(false);
    }
  }

  /**
   * Delete chat room.
   * @param { ChatRoomEdge } chatRoom - Chat room to delete.
   * @returns { Promise<boolean> } - Whether chat room was deleted.
   */
  public async deleteChatRoom(chatRoom: ChatRoomEdge): Promise<boolean> {
    if (this.actionInProgress$.getValue()) {
      return;
    }

    this.actionInProgress$.next(true);

    try {
      const response: MutationResult<DeleteChatRoomMutation> =
        await lastValueFrom(
          this.deleteChatRoomGQL.mutate({ roomGuid: chatRoom.node.guid })
        );

      if (response.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      if (!response.data.deleteChatRoom) {
        throw new Error('Could not delete chat room');
      }

      this.toaster.success('Chat room deleted');
      return true;
    } catch (e) {
      this.toaster.error(e);
      return false;
    } finally {
      this.actionInProgress$.next(false);
    }
  }

  /**
   * Delete group chat rooms by group GUID.
   * @param { string } groupGuid - GUID of the group.
   * @returns { Promise<boolean> } - Whether group chat rooms were deleted.
   */
  public async deleteGroupChatRooms(groupGuid: string): Promise<boolean> {
    if (this.actionInProgress$.getValue()) {
      return;
    }

    this.actionInProgress$.next(true);

    try {
      const response: MutationResult<DeleteGroupChatRoomsMutation> =
        await lastValueFrom(
          this.deleteGroupChatRoomsGQL.mutate({ groupGuid: groupGuid })
        );

      if (response.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      if (!response.data.deleteGroupChatRooms) {
        throw new Error("Could not delete this group's chat rooms");
      }

      this.toaster.success('Chat rooms deleted');
      return true;
    } catch (e) {
      this.toaster.error(e);
      return false;
    } finally {
      this.actionInProgress$.next(false);
    }
  }

  /**
   * Leave chat room.
   * @param { ChatRoomEdge } chatRoom - Chat room to leave.
   * @returns { Promise<boolean> } - Whether chat room was left.
   */
  public async leaveChatRoom(chatRoom: ChatRoomEdge): Promise<boolean> {
    if (this.actionInProgress$.getValue()) {
      return;
    }

    this.actionInProgress$.next(true);

    try {
      const response: MutationResult<LeaveChatRoomMutation> =
        await lastValueFrom(
          this.leaveChatRoomGQL.mutate({ roomGuid: chatRoom.node.guid })
        );
      if (response.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      if (!response.data.leaveChatRoom) {
        throw new Error('Could not leave chat room');
      }

      this.toaster.success('Left chat room');
      return true;
    } catch (e) {
      this.toaster.error(e);
      return false;
    } finally {
      this.actionInProgress$.next(false);
    }
  }

  /**
   * Remove a user from a chat room.
   * @param { ChatRoomEdge } chatRoom - Chat room to remove user from.
   * @param { UserNode } user - User to remove from chat room.
   * @returns { Promise<boolean> } - Whether user was removed from chat room.
   */
  public async removeFromChatRoom(
    chatRoom: ChatRoomEdge,
    user: UserNode
  ): Promise<boolean> {
    if (this.actionInProgress$.getValue()) {
      return;
    }

    this.actionInProgress$.next(true);

    try {
      const response: MutationResult<RemoveMemberFromChatRoomMutation> =
        await lastValueFrom(
          this.removeMemberFromChatRoomGql.mutate({
            roomGuid: chatRoom.node.guid,
            memberGuid: user.guid,
          })
        );

      if (response.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      if (!response.data.removeMemberFromChatRoom) {
        throw new Error('Failed to remove member from chat room');
      }

      this.toaster.success('Member removed from chat room');
      return true;
    } catch (e) {
      this.toaster.error(e);
      return false;
    } finally {
      this.actionInProgress$.next(false);
    }
  }
}
