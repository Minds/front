import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { MessengerConversationDockpanesService } from '../../../messenger/dockpanes/dockpanes.service';
import { MessengerConversationBuilderService } from '../../../messenger/dockpanes/conversation-builder.service';
import { ChannelsV2Service } from '../channels-v2.service';
import { ApiService } from '../../../../common/api/api.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../common/services/toaster.service';
import { ChatExperimentService } from '../../../experiments/sub-services/chat-experiment.service';
import { CreateChatRoomService } from '../../../chat/services/create-chat-room.service';
import { Router } from '@angular/router';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';

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

  /** Whether chat experiment is active. */
  protected isChatExperimentActive: boolean = false;

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
    protected cd: ChangeDetectorRef,
    private toaster: ToasterService,
    private chatExperiment: ChatExperimentService,
    private createChatRoom: CreateChatRoomService,
    private router: Router,
    @Inject(IS_TENANT_NETWORK) protected isTenantNetwork: boolean
  ) {
    this.isChatExperimentActive = this.chatExperiment.isActive();
  }

  /**
   * Opens conversation pane
   */
  async message(): Promise<void> {
    if (this.isChatExperimentActive) {
      return this.handleMindsInternalChatRequest();
    }
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
    } catch (e) {
      this.toaster.error(e.error?.message ?? 'An error has occurred');
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  /**
   * Handle Minds internal Chat platform requests.
   * @returns { Promise<void> }
   */
  private async handleMindsInternalChatRequest(): Promise<void> {
    this.inProgress = true;
    this.detectChanges();

    try {
      const chatRoomId: string = await this.createChatRoom.createChatRoom([
        this.service.channel$.getValue(),
      ]);

      if (!chatRoomId) {
        throw new Error('Chat room creation failed');
      }

      this.router.navigateByUrl(`/chat/rooms/${chatRoomId}`);
    } catch (e) {
      console.error(e);
      this.toaster.error(DEFAULT_ERROR_MESSAGE);
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
