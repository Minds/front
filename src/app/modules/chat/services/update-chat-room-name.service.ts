import { Injectable } from '@angular/core';
import {
  UpdateChatRoomNameGQL,
  UpdateChatRoomNameMutation,
} from '../../../../graphql/generated.engine';
import { lastValueFrom } from 'rxjs';
import { MutationResult } from 'apollo-angular';
import { ToasterService } from '../../../common/services/toaster.service';
import { InMemoryCache } from '@apollo/client';

/**
 * Service to handle the updating of chat room names.
 */
@Injectable({ providedIn: 'root' })
export class UpdateChatRoomNameService {
  constructor(
    private updateChatRoomNameGQL: UpdateChatRoomNameGQL,
    private toaster: ToasterService
  ) {}

  /**
   * Update a chat room name.
   * @param { string } roomGuid - the chat room guid.
   * @param { string } roomName - the chat room name.
   * @returns { Promise<boolean> } - true on success.
   */
  public async update(roomGuid: string, roomName: string): Promise<boolean> {
    try {
      const response: MutationResult<UpdateChatRoomNameMutation> =
        await lastValueFrom(
          this.updateChatRoomNameGQL.mutate(
            {
              roomGuid,
              roomName,
            },
            {
              update: this.handleUpdateSuccess.bind(this),
            }
          )
        );

      if (response.errors?.length) {
        throw new Error(response.errors[0].message);
      }

      if (!response?.data?.updateChatRoomName) {
        throw new Error('Failed to update chat room name');
      }

      return true;
    } catch (e: unknown) {
      console.error(e);
      this.toaster.error(e);
    }
  }

  /**
   * Handle cache updates on success.
   * @param { InMemoryCache } cache - the in memory cache.
   * @param { MutationResult<UpdateChatRoomNameMutation> } result - the mutation result.
   * @param { any } options - the options.
   */
  private handleUpdateSuccess(
    cache: InMemoryCache,
    result: MutationResult<UpdateChatRoomNameMutation>,
    options: any
  ): void {
    cache.modify({
      id: `ChatRoomNode:urn:chat:${options.variables.roomGuid}`,
      fields: {
        name: () => options.variables.roomName,
      },
    });
  }
}
