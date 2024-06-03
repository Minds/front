import { NgModule } from '@angular/core';
import { EditChatRoomModalComponent } from './edit-chat-room-modal.component';

/**
 * Module for lazy loading edit chat room component.
 */
@NgModule({
  imports: [EditChatRoomModalComponent],
})
export class EditChatRoomModalModule {
  public resolveComponent(): typeof EditChatRoomModalComponent {
    return EditChatRoomModalComponent;
  }
}
