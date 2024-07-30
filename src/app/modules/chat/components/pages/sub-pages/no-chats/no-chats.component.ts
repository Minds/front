import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatActionCardComponent } from '../../../action-cards/action-card.component';
import { StartChatModalService } from '../../../start-chat-modal/start-chat-modal.service';
import { ChatRoomsListService } from '../../../../services/chat-rooms-list.service';
import { PermissionIntentsService } from '../../../../../../common/services/permission-intents.service';
import { PermissionsEnum } from '../../../../../../../graphql/generated.engine';

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
      data-ref="data-minds-no-chats-new-chat-button"
    ></m-chat__actionCard>
  `,
})
export class NoChatsSubPageComponent {
  constructor(
    private startChatModal: StartChatModalService,
    private chatRoomsListService: ChatRoomsListService,
    private permissionIntentsService: PermissionIntentsService
  ) {}

  /**
   * Handles the click on the new chat button.
   * @returns { Promise<void> }
   */
  protected async onStartNewChatClick(): Promise<void> {
    if (
      !this.permissionIntentsService.checkAndHandleAction(
        PermissionsEnum.CanCreateChatRoom
      )
    ) {
      return;
    }

    const result: string = await this.startChatModal.open(true);
    if (result) {
      this.chatRoomsListService.refetch();
    }
  }
}
