import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessengerConversationDockpanesService } from '../../../messenger/dockpanes/dockpanes.service';
import { MessengerConversationBuilderService } from '../../../messenger/dockpanes/conversation-builder.service';
import { ChannelsV2Service } from '../channels-v2.service';

/**
 * Message button (non-owner)
 */
@Component({
  selector: 'm-channelActions__message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'message.component.html',
})
export class ChannelActionsMessageComponent {
  /**
   * Constructor
   * @param service
   * @param dockpanes
   * @param conversationBuilder
   */
  constructor(
    public service: ChannelsV2Service,
    protected dockpanes: MessengerConversationDockpanesService,
    protected conversationBuilder: MessengerConversationBuilderService
  ) {}

  /**
   * Opens conversation pane
   */
  message(): void {
    this.dockpanes.open(
      this.conversationBuilder.buildConversation(
        this.service.channel$.getValue()
      )
    );
  }
}
