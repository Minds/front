import {
  Component,
  Input,
  Output,
  EventEmitter,
  Injector,
} from '@angular/core';
import { Router } from '@angular/router';

import { GroupsService } from '../groups.service';
import { ReportCreatorComponent } from '../../report/creator/creator.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { FormToastService } from '../../../common/services/form-toast.service';
import { ConfirmV2Component } from '../../modals/confirm-v2/confirm';

@Component({
  selector: 'minds-groups-settings-button',
  template: `
    <button class="material-icons" (click)="toggleMenu($event)">
      settings
      <i
        *ngIf="group['is:muted']"
        class="minds-groups-button-badge material-icons"
        >notifications_off</i
      >
    </button>

    <ul class="minds-dropdown-menu" [hidden]="!showMenu">
      <!-- owner functions -->
      <li
        class="mdl-menu__item"
        *ngIf="group['is:owner']"
        (click)="toggleEdit()"
      >
        <ng-container *ngIf="!editing">Edit</ng-container>
        <ng-container *ngIf="editing">Save</ng-container>
      </li>

      <li
        class="mdl-menu__item"
        *ngIf="group['is:owner'] && group.videoChatDisabled"
        (click)="toggleVideoChat(true)"
      >
        Enable gathering
      </li>
      <li
        class="mdl-menu__item"
        *ngIf="group['is:owner'] && !group.videoChatDisabled"
        (click)="toggleVideoChat(false)"
      >
        Disable gathering
      </li>

      <li
        class="mdl-menu__item"
        *ngIf="group['is:owner'] && group.moderated"
        (click)="toggleModeration(false)"
      >
        Disable moderation
      </li>
      <li
        class="mdl-menu__item"
        *ngIf="group['is:owner'] && !group.moderated"
        (click)="toggleModeration(true)"
      >
        Enable moderation
      </li>

      <li
        class="mdl-menu__item"
        *ngIf="group['is:owner'] && !group.membership"
        (click)="togglePublic(true)"
      >
        Make public
      </li>
      <li
        class="mdl-menu__item"
        *ngIf="group['is:owner'] && group.membership"
        (click)="togglePublic(false)"
      >
        Make closed
      </li>

      <li
        class="mdl-menu__item"
        *ngIf="
          (group['is:owner'] || group['is:moderator']) &&
          group.conversationDisabled
        "
        (click)="toggleConversation(true); showMenu = false"
        i18n="@@GROUPS__PROFILE__GROUP_SETTINGS_BTN__ENABLE_CONVERSATION"
      >
        Enable conversation
      </li>
      <li
        class="mdl-menu__item"
        *ngIf="
          (group['is:owner'] || group['is:moderator']) &&
          !group.conversationDisabled
        "
        (click)="toggleConversation(false); showMenu = false"
        i18n="@@GROUPS__PROFILE__GROUP_SETTINGS_BTN__DISABLE_CONVERSATION"
      >
        Disable conversation
      </li>

      <!-- Member functions -->
      <li
        class="mdl-menu__item"
        [hidden]="group['is:muted']"
        (click)="mute()"
        i18n="@@GROUPS__PROFILE__GROUP_SETTINGS_BTN__DISABLE_NOTIFICATIONS"
      >
        Disable notifications
      </li>
      <li
        class="mdl-menu__item"
        [hidden]="!group['is:muted']"
        (click)="unmute()"
        i18n="@@GROUPS__PROFILE__GROUP_SETTINGS_BTN__ENABLE_NOTIFICATIONS"
      >
        Enable notifications
      </li>

      <!-- admin functions -->
      <li
        class="mdl-menu__item"
        *ngIf="session.isAdmin() && !group.mature"
        (click)="setExplicit(true)"
        i18n="@@M__ACTION__SET_EXPLICIT"
      >
        Set explicit
      </li>
      <li
        class="mdl-menu__item"
        *ngIf="session.isAdmin() && group.mature"
        (click)="setExplicit(false)"
        i18n="@@M__ACTION__REMOVE_EXPLICIT"
      >
        Remove explicit
      </li>
      <li
        class="mdl-menu__item"
        (click)="report(); showMenu = false"
        i18n="@@M__ACTION__REPORT"
      >
        Report
      </li>
      <li
        class="mdl-menu__item"
        *ngIf="group['is:creator']"
        [hidden]="group.deleted"
        (click)="deletePrompt()"
        i18n="@@GROUPS__PROFILE__GROUP_SETTINGS_BTN__DELETE_GROUP"
        data-cy="data-minds-group-dropdown-delete"
      >
        Delete group
      </li>

      <li
        class="mdl-menu__item m-groups-settings-dropdown__item--nsfw"
        *ngIf="session.isAdmin()"
      >
        <m-nsfw-selector
          service="editing"
          [selected]="group.nsfw"
          (selectedChange)="onNSFWSelected($event)"
        >
        </m-nsfw-selector>
      </li>
    </ul>
    <div
      class="minds-bg-overlay"
      (click)="toggleMenu($event)"
      [hidden]="!showMenu"
    ></div>

    <m-modal [open]="featureModalOpen" (closed)="onFeatureModalClose($event)">
      <div class="m-button-feature-modal">
        <select [(ngModel)]="category">
          <option value="not-selected" i18n="@@M__COMMON__SELECT_A_CATEGORY"
            >-- SELECT A CATEGORY --
          </option>
          <option *ngFor="let category of categories" [value]="category.id">{{
            category.label
          }}</option>
        </select>

        <button
          class="mdl-button mdl-button--colored"
          (click)="feature()"
          i18n="@@M__ACTION__FEATURE"
        >
          Feature
        </button>
      </div>
    </m-modal>
  `,
})
export class GroupsSettingsButton {
  group: any = {
    'is:muted': false,
    deleted: false,
  };

  @Input('group') set _group(value: any) {
    if (!value) return;
    this.group = value;
    this.featured = value.featured_id || value.featured === true;
  }

  @Output() groupChange: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();

  editing: boolean = false;
  showMenu: boolean = false;

  categories: Array<any> = [];
  category: string = 'not-selected';

  featured: boolean = false;

  featureModalOpen: boolean = false;

  constructor(
    public service: GroupsService,
    public client: Client,
    public session: Session,
    private injector: Injector,
    public overlayService: OverlayModalService,
    public router: Router,
    protected toasterService: FormToastService
  ) {}

  ngOnInit() {}

  async mute() {
    this.group['is:muted'] = true;

    try {
      const isMuted: boolean = await this.service.muteNotifications(this.group);
      this.group['is:muted'] = isMuted;
    } catch (e) {
      this.group['is:muted'] = false;
    }

    this.showMenu = false;
  }

  async unmute() {
    this.group['is:muted'] = false;

    try {
      const isMuted: boolean = await this.service.unmuteNotifications(
        this.group
      );
      this.group['is:muted'] = isMuted;
    } catch (e) {
      this.group['is:muted'] = true;
    }

    this.showMenu = false;
  }

  openFeatureModal() {
    this.featureModalOpen = true;
  }

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

  report() {
    this.overlayService.create(ReportCreatorComponent, this.group).present();
  }

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

    this.openConfirmationModal();
  }

  setExplicit(value) {
    this.service.setExplicit(this.group.guid, value).then(result => {
      if (result) {
        this.group.mature = value;
      }
    });
  }

  delete() {
    this.group.deleted = true;

    this.service.deleteGroup(this.group).then(deleted => {
      this.group.deleted = deleted;

      if (deleted) {
        this.toasterService.success('Your group has been successfully deleted');
        this.router.navigate(['/']);
      }
    });

    this.showMenu = false;
  }

  toggleMenu(e) {
    e.stopPropagation();
    if (this.showMenu) {
      this.showMenu = false;

      return;
    }
    this.showMenu = true;
    // TODO: [emi] Maybe refresh state?
  }

  toggleEdit() {
    this.editing = !this.editing;
    this.showMenu = false;
    this.change.emit({ editing: this.editing });
  }

  toggleVideoChat(enabled: boolean) {
    this.group.videoChatDisabled = enabled ? 0 : 1;
    this.client.post(`api/v1/groups/group/${this.group.guid}`, {
      videoChatDisabled: this.group.videoChatDisabled,
    });
    this.groupChange.next(this.group);
  }

  toggleModeration(enabled: boolean) {
    this.group.moderated = enabled ? 1 : 0;
    this.client.post(`api/v1/groups/group/${this.group.guid}`, {
      moderated: this.group.moderated,
    });
    this.groupChange.next(this.group);
  }

  togglePublic(enabled: boolean) {
    this.group.membership = enabled ? 2 : 0;
    this.client.post(`api/v1/groups/group/${this.group.guid}`, {
      membership: this.group.membership,
    });
    this.groupChange.next(this.group);
  }

  onNSFWSelected(reasons: Array<{ label; value; selected }>) {
    console.log('group', this.group);
    const nsfw = reasons.map(reason => reason.value);
    this.client.post(`api/v2/admin/nsfw/${this.group.guid}`, { nsfw });
    this.group.nsfw = nsfw;
  }

  /**
   * Opens confirmation of deletion modal
   * @returns { void }
   */
  public openConfirmationModal(): void {
    let component: Object = ConfirmV2Component;

    this.overlayService
      .create(
        component,
        null,
        {
          wrapperClass: 'm-modalV2__wrapper',
          title: 'Confirm',
          body:
            'Are you sure you want to delete this? This action cannot be undone.',
          onConfirm: () => {
            this.delete();
            this.router.navigate(['/']);
            this.overlayService.dismiss();
          },
          onDismiss: () => {
            this.overlayService.dismiss();
          },
        },
        this.injector
      )
      .onDidDismiss(() => {})
      .present();
  }
}
