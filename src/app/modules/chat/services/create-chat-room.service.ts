import { Injectable } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import {
  ChatRoomTypeEnum,
  CreateChatRoomGQL,
  CreateChatRoomMutation,
} from '../../../../graphql/generated.engine';
import { firstValueFrom } from 'rxjs';
import { MutationResult } from 'apollo-angular';

/**
 * Service for handling the creation of chat rooms.
 */
@Injectable({ providedIn: 'root' })
export class CreateChatRoomService {
  constructor(private createChatRoomGql: CreateChatRoomGQL) {}

  /**
   * Creates a chat room.
   * @param { MindsUser[]|string[] } otherMembers - The other participants to add to the chat room. Can be either an array of users or GUIDs.
   * @param { ChatRoomTypeEnum } roomType - The type of chat room to create.
   * @returns { Promise<string> } - The guid of the chat room.
   */
  public async createChatRoom(
    otherMembers: MindsUser[] | string[],
    roomType: ChatRoomTypeEnum = null
  ): Promise<string> {
    otherMembers = otherMembers.map(
      (participant: MindsUser | string): string => {
        return typeof participant === 'string' ? participant : participant.guid;
      }
    );

    const response: MutationResult<CreateChatRoomMutation> = await firstValueFrom(
      this.createChatRoomGql.mutate({
        otherMemberGuids: otherMembers,
        roomType: roomType,
      })
    );

    return response.data?.createChatRoom?.node?.guid ?? null;
  }
}
