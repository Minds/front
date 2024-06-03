import { Injectable, Injector, createNgModule } from '@angular/core';
import { EditChatRoomModalModule } from './edit-chat-room-modal.module';
import {
  ModalRef,
  ModalService,
} from '../../../../../services/ux/modal.service';
import { EditChatRoomModalComponent } from './edit-chat-room-modal.component';
import { ChatRoomEdge } from '../../../../../../graphql/generated.engine';

/**
 * Edit chat room modal service - opens modal to allow the user to
 * edit their chat room details.
 */
@Injectable({ providedIn: 'root' })
export class EditChatRoomModalService {
  constructor(
    private injector: Injector,
    private modalService: ModalService
  ) {}

  /**
   * Opens the edit chat room modal.
   * @param { ChatRoomEdge } chatRoomEdge - Chat room edge.
   * @returns { Promise<void> }
   */
  public async open(chatRoomEdge: ChatRoomEdge): Promise<boolean> {
    const modal: ModalRef<any> = this.modalService.present(
      await this.getComponentRef(),
      {
        injector: this.injector,
        lazyModule: EditChatRoomModalModule,
        size: 'md',
        data: {
          chatRoomEdge: chatRoomEdge,
          onCompleted: () => {
            modal.close(true);
          },
        },
      }
    );
    return modal.result;
  }

  /**
   * Gets reference to component to load.
   * @returns { Promise<typeof EditChatRoomModalModule> }
   */
  private async getComponentRef(): Promise<typeof EditChatRoomModalComponent> {
    return createNgModule<EditChatRoomModalModule>(
      (await import('./edit-chat-room-modal.module')).EditChatRoomModalModule,
      this.injector
    ).instance.resolveComponent();
  }
}
