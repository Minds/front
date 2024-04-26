import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatActionCardComponent } from '../../../action-cards/action-card.component';
import { StartChatModalService } from '../../../start-chat-modal/start-chat-modal.service';
import { PermissionsService } from '../../../../../../common/services/permissions.service';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { ChatRoomsListService } from '../../../../services/chat-rooms-list.service';

/**
 * Subpage to be shown when no chats are opened.
 */
@Component({
  selector: 'm-chat__noChatsSubPage',
  styleUrls: ['./no-chats.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChatActionCardComponent],
  standalone: true,
  template: `
    <m-chat__actionCard
      headerText="Your chats"
      descriptionText="Select from existing conversations, send a friend a message, or start a group chat."
      ctaText="New chat"
      (actionButtonClick)="onStartNewChatClick()"
    ></m-chat__actionCard>
  `,
})
export class NoChatsSubPageComponent {
  constructor(
    private startChatModal: StartChatModalService,
    private permissionsService: PermissionsService,
    private chatRoomsListService: ChatRoomsListService,
    private toaster: ToasterService
  ) {}

  /**
   * Handles the click on the new chat button.
   * @returns { Promise<void> }
   */
  protected async onStartNewChatClick(): Promise<void> {
    if (!this.permissionsService.canCreateChatRoom()) {
      this.toaster.warn("You don't have permission to create a chat room");
      return;
    }

    const result: string = await this.startChatModal.open(true);
    if (result) {
      this.chatRoomsListService.refetch();
    }
  }
}
