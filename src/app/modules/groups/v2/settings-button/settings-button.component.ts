import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { ReportCreatorComponent } from '../../../report/creator/creator.component';
import { Session } from '../../../../services/session';
import { ConfirmV2Component } from '../../../modals/confirm-v2/confirm.component';
import { ModalService } from '../../../../services/ux/modal.service';
import { BoostModalV2LazyService } from '../../../boost/modal-v2/boost-modal-v2-lazy.service';
import { GroupService } from '../group.service';
import { Subscription } from 'rxjs';
import { NsfwEnabledService } from '../../../multi-tenant-network/services/nsfw-enabled.service';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { GroupChatRoomService } from '../services/group-chat-rooms.service';
import { ToasterService } from '../../../../common/services/toaster.service';

/**
 * Dropdown menu with options to change various group behaviors.
 * Options are tailored to roles/permissions of the user.
 */
@Component({
  selector: 'm-group__settingsButton',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.ng.scss'],
})
export class GroupSettingsButton implements OnInit, OnDestroy {
  group;

  /** Whether the user has permission to boost. */
  protected hasBoostPermission: boolean = false;

  private subscriptions: Subscription[] = [];
  constructor(
    public service: GroupService,
    public session: Session,
    private injector: Injector,
    public modalService: ModalService,
    private boostModal: BoostModalV2LazyService,
    protected nsfwEnabledService: NsfwEnabledService,
    private permissionsService: PermissionsService,
    private groupChatService: GroupChatRoomService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.hasBoostPermission = this.permissionsService.canBoost();
    this.subscriptions.push(
      this.service.group$.subscribe((group) => {
        this.group = group;
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Enable/disable notifications
   */
  async toggleNotifications(enable: boolean) {
    this.service.toggleNotifications(enable);
  }

  /**
   * Enable/disable whether the group is moderated
   */
  async toggleModeration(enable: boolean) {
    this.service.toggleModeration(enable);
  }

  /**
   * Enable/disable whether the group is private/public
   */
  async togglePrivate(enable: boolean) {
    this.service.togglePrivate(enable);
  }

  /**
   * Enable/disable showing boosts in the feed
   */
  async toggleShowBoosts(enable: boolean) {
    this.service.toggleShowBoosts(enable);
  }

  /**
   * Whether the group is nsfw
   */
  async toggleExplicit(enable) {
    this.service.toggleExplicit(enable);
  }

  /**
   * Delete chat rooms for the group.
   * @returns { Promise<void> }
   */
  public async deleteChatRooms(): Promise<void> {
    const modal = this.modalService.present(ConfirmV2Component, {
      data: {
        title: 'Disable chat room?',
        body: "Your current group's chat history will be deleted if you disable the chat room. You can always enable the group's chat room after disabling to get a new chat room with all your group members.",
        confirmButtonColor: 'red',
        confirmButtonSolid: false,
        confirmButtonText: 'Disable',
        showCancelButton: false,
        onConfirm: async () => {
          modal.dismiss();

          try {
            if (
              await this.groupChatService.deleteGroupChatRooms(this.group.guid)
            ) {
              this.service.setConversationDisabled(true);
              this.toasterService.success('Chat room deleted');
            }
          } catch (e: unknown) {
            this.toasterService.error(e);
          }
        },
      },
      injector: this.injector,
    });
  }

  /**
   * Create a chat room for the group.
   * @returns { Promise<void> }
   */
  public async createChatRoom(): Promise<void> {
    try {
      if (await this.groupChatService.createGroupChatRoom(this.group.guid)) {
        this.service.setConversationDisabled(false);
        this.toasterService.success('Chat room created');
      }
    } catch (e: unknown) {
      this.toasterService.error(e);
    }
  }

  /**
   * Opens the report modal to report a group
   */
  openReportModal() {
    return this.modalService.present(ReportCreatorComponent, {
      data: {
        entity: this.group,
      },
    });
  }

  /**
   * Opens confirmation of deletion modal
   * if deletion is possible
   * @returns { void }
   */
  public openDeleteConfirmationModal(): void {
    const modal = this.modalService.present(ConfirmV2Component, {
      data: {
        title: 'Delete Group',
        body: 'Are you sure you want to delete this? This action cannot be undone.',
        confirmButtonColor: 'red',
        onConfirm: () => {
          modal.dismiss();
          this.service.delete();
        },
      },
      injector: this.injector,
    });
  }

  /**
   * On Boost group click, open, boost modal for group.
   * @returns { Promise<void> }
   */
  public async onBoostGroupClick(): Promise<void> {
    try {
      await this.boostModal.open(this.group);
    } catch (e) {
      // do nothing.
    }
  }
}
