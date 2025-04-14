import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
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
import { CreateChatRoomService } from '../../../chat/services/create-chat-room.service';
import { Router } from '@angular/router';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';
import { PermissionIntentsService } from '../../../../common/services/permission-intents.service';
import { PermissionsEnum } from '../../../../../graphql/generated.engine';

/**
 * Message button (non-owner) - action button shown to logged-in channel visitors.
 * Clicking it opens a new tab to a Minds Chat room for the two relevant users.
 */
@Component({
  selector: 'm-channelActions__message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'message.component.html',
})
export class ChannelActionsMessageComponent implements OnInit {
  inProgress = false;

  /** Whether chat experiment is active. */

  /** Whether button should be shown */
  protected shouldShow = false;

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
    private createChatRoom: CreateChatRoomService,
    private permissionIntentsService: PermissionIntentsService,
    private router: Router,
    @Inject(IS_TENANT_NETWORK) protected isTenantNetwork: boolean
  ) {}

  ngOnInit(): void {
    this.shouldShow = !this.permissionIntentsService.shouldHide(
      PermissionsEnum.CanCreateChatRoom
    );
  }

  /**
   * Opens conversation pane
   */
  async message(): Promise<void> {
    return this.handleMindsInternalChatRequest();
  }

  /**
   * Handle Minds internal Chat platform requests.
   * @returns { Promise<void> }
   */
  private async handleMindsInternalChatRequest(): Promise<void> {
    if (
      !this.permissionIntentsService.checkAndHandleAction(
        PermissionsEnum.CanCreateChatRoom
      )
    ) {
      return;
    }

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
      this.toaster.error(e);
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
