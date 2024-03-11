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
   * @param { MindsUser[] } participants - The participants to add to the chat room.
   * @param { ChatRoomTypeEnum } roomType - The type of chat room to create.
   * @returns { Promise<string> } - The guid of the chat room.
   */
  public async createChatRoom(
    participants: MindsUser[],
    roomType: ChatRoomTypeEnum
  ): Promise<string> {
    const response: MutationResult<CreateChatRoomMutation> = await firstValueFrom(
      this.createChatRoomGql.mutate({
        otherMemberGuids: participants.map(
          (participant: MindsUser): string => participant.guid
        ),
        roomType: roomType,
      })
    );
    return response.data?.createChatRoom?.node?.guid ?? null;
  }
}
