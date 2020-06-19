import { Component, OnDestroy } from '@angular/core';
import { GroupV2Service } from '../../../services/group-v2.service';
import { Session } from '../../../../../../services/session';
import { Subscription } from 'rxjs';
import { Client } from '../../../../../../services/api/client';
import { ReportCreatorComponent } from '../../../../../report/creator/creator.component';
import { Router } from '@angular/router';
import { OverlayModalService } from '../../../../../../services/ux/overlay-modal';
import { FormToastService } from '../../../../../../common/services/form-toast.service';

@Component({
  selector: 'm-groupActions__edit',
  templateUrl: 'edit.component.html',
})
export class GroupActionEditComponent implements OnDestroy {
  group: any = {
    'is:muted': false,
    deleted: false,
  };
  featured: boolean = false;
  groupSubscription: Subscription;
  featureModalOpen: boolean = false;

  categories: Array<any> = [];
  category: string = 'not-selected';

  showMenu: boolean = false;

  isGoingToBeDeleted: boolean = false;

  /**
   * Constructor
   * @param service
   * @param client
   * @param session
   * @param toasterService
   * @param overlayService
   * @param router
   */
  constructor(
    public service: GroupV2Service,
    public client: Client,
    public session: Session,
    protected toasterService: FormToastService,
    protected overlayService: OverlayModalService,
    protected router: Router
  ) {
    this.groupSubscription = this.service.group$.subscribe(group => {
      this.group = group;
      this.featured = group.featured_id || group.featured === true;
    });
  }

  /**
   * Mutes notifications for a group
   */
  async mute() {
    this.group['is:muted'] = await this.service.muteNotifications(this.group);
    this.showMenu = false;
  }

  /**
   * Unmutes notifications for a group
   */
  async unmute() {
    this.group['is:muted'] = await this.service.unmuteNotifications(this.group);
    this.showMenu = false;
  }

  /**
   * Features a group (admin only)
   */
  async feature() {
    this.featured = true;
    this.group.featured = true;

    try {
      await this.client.put(
        `api/v1/admin/feature/${this.group.guid}/${this.category}`,
        {}
      );
      this.featureModalOpen = false;
    } catch (e) {
      this.featured = false;
    }
  }

  /**
   * Un-features a group (admin only)
   */
  async unfeature() {
    this.featured = false;
    this.group.featured = false;

    try {
      await this.client.delete(`api/v1/admin/feature/${this.group.guid}`);
    } catch (e) {
      this.featured = true;
    }
  }

  onFeatureModalClose(e) {
    this.featureModalOpen = false;
  }

  /**
   * Opens report modal
   */
  report() {
    this.overlayService.create(ReportCreatorComponent, this.group).present();
  }

  /**
   * Opens the edit modal
   */
  openEditModal() {
    this.service.openEditModal();
    this.showMenu = false;
  }

  /**
   * Enables or disables the gatherings
   * @param enabled
   */
  toggleVideoChat(enabled: boolean) {
    this.group.videoChatDisabled = enabled ? 0 : 1;
    this.client.post(`api/v1/groups/group/${this.group.guid}`, {
      videoChatDisabled: this.group.videoChatDisabled,
    });
    this.service.group$.next(this.group);
  }

  /**
   * Enables or disables the group chats
   * @param enabled
   */
  async toggleConversation(enabled: boolean) {
    try {
      this.group.conversationDisabled = !enabled;
      await this.service.toggleConversation(this.group.guid, enabled);
    } catch (e) {
      this.group.conversationDisabled = enabled;
    }
  }

  /**
   * deletePrompt
   * Displays the delete prompt if deletion is possible
   */
  async deletePrompt() {
    if ((await this.service.countMembers(this.group.guid)) !== 1) {
      this.toasterService.error('You cannot delete a group that has members.');
      return;
    }
    this.isGoingToBeDeleted = true;
  }

  cancelDelete() {
    this.isGoingToBeDeleted = false;
  }

  /**
   * Marks the group as explicit
   * @param value
   */
  async setExplicit(value) {
    const result = await this.service.setExplicit(this.group.guid, value);
    if (result) {
      this.group.mature = value;
    }
  }

  /**
   * Deletes a group
   */
  async delete() {
    if (!this.isGoingToBeDeleted) {
      return;
    }

    this.group.deleted = true;

    const deleted: boolean = await this.service.deleteGroup();
    this.group.deleted = deleted;

    if (deleted) {
      this.router.navigate(['/groups/member']);
    }

    this.showMenu = false;
    this.isGoingToBeDeleted = false;
  }

  /**
   * Opens/Closes the menu
   * @param e
   */
  toggleMenu(e) {
    e.stopPropagation();
    if (this.showMenu) {
      this.showMenu = false;

      return;
    }
    this.showMenu = true;
  }

  /**
   * Changes nsfw tags in the group
   * @param reasons
   */
  onNSFWSelected(reasons: Array<{ label; value; selected }>) {
    const nsfw = reasons.map(reason => reason.value);
    this.client.post(`api/v2/admin/nsfw/${this.group.guid}`, { nsfw });
    this.group.nsfw = nsfw;
  }

  ngOnDestroy() {
    this.groupSubscription.unsubscribe();
  }
}
