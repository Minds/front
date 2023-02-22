import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { MessengerConversationDockpanesService } from '../../../messenger/dockpanes/dockpanes.service';
import { MessengerConversationBuilderService } from '../../../messenger/dockpanes/conversation-builder.service';
import { ChannelsV2Service } from '../channels-v2.service';
import { ApiService } from '../../../../common/api/api.service';
import { ConfigsService } from '../../../../common/services/configs.service';

/**
 * Message button (non-owner) - action button shown to logged-in channel visitors.
 * Clicking it opens a new tab to a Minds Chat room for the two relevant users.
 */
@Component({
  selector: 'm-channelActions__message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'message.component.html',
})
export class ChannelActionsMessageComponent {
  inProgress = false;

  /**
   * Constructor
   * @param service
   * @param dockpanes
   * @param conversationBuilder
   */
  constructor(
    public service: ChannelsV2Service,
    protected dockpanes: MessengerConversationDockpanesService,
    protected conversationBuilder: MessengerConversationBuilderService,
    protected api: ApiService,
    protected configs: ConfigsService,
    protected cd: ChangeDetectorRef
  ) {}

  /**
   * Opens conversation pane
   */
  async message(): Promise<void> {
    this.inProgress = true;
    try {
      const response = await this.api
        .put('api/v3/matrix/room/' + this.service.channel$.getValue().guid)
        .toPromise();

      this.inProgress = false;
      this.detectChanges();

      const roomId = response?.room?.id;
      window.open(
        this.configs.get('matrix')?.chat_url + '/#/room/' + roomId,
        'chat'
      );
    } catch {
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
