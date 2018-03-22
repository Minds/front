import { Component} from '@angular/core';
import { Router } from '@angular/router';

import { GroupsService } from '../groups-service';
import { ReportCreatorComponent } from '../../report/creator/creator.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';

@Component({
  selector: 'minds-groups-settings-button',
  inputs: ['group'],
  template: `
    <button class="material-icons" (click)="toggleMenu($event)">
      settings
      <i *ngIf="group['is:muted']" class="minds-groups-button-badge material-icons">notifications_off</i>
    </button>

    <ul class="minds-dropdown-menu" [hidden]="!showMenu" >
      <li class="mdl-menu__item" [hidden]="group['is:muted']" (click)="mute()" i18n="@@GROUPS__PROFILE__GROUP_SETTINGS_BTN__DISABLE_NOTIFICATIONS">Disable Notifications</li>
      <li class="mdl-menu__item" [hidden]="!group['is:muted']" (click)="unmute()" i18n="@@GROUPS__PROFILE__GROUP_SETTINGS_BTN__ENABLE_NOTIFICATIONS">Enable Notifications</li>
      <li class="mdl-menu__item" (click)="report(); showMenu = false" i18n="@@M__ACTION__REPORT">Report</li>
      <li class="mdl-menu__item" *ngIf="group['is:creator']" [hidden]="group.deleted" (click)="deletePrompt()" i18n="@@GROUPS__PROFILE__GROUP_SETTINGS_BTN__DELETE_GROUP">Delete Group</li>
    </ul>
    <div class="minds-bg-overlay" (click)="toggleMenu($event)" [hidden]="!showMenu"></div>

    <m-modal [open]="group['is:owner'] && isGoingToBeDeleted">
      <div class="mdl-card__supporting-text">
        <p i18n="@@GROUPS__PROFILE__GROUP_SETTINGS_BTN__DELETE_GROUP_CONFIRM">Are you sure you want to delete {{ group.name }}? This action cannot be undone.</p>
      </div>
      <div class="mdl-card__actions">
        <button (click)="delete()" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
          <ng-container i18n="@@M__ACTION__CONFIRM">Confirm</ng-container>
        </button>
        <button (click)="cancelDelete()" class="mdl-button mdl-js-button mdl-button--colored">
          <ng-container i18n="@@M__ACTION__CANCEL">Cancel</ng-container>
        </button>
      </div>
    </m-modal>
  `
})

export class GroupsSettingsButton {

  group: any = {
    'is:muted': false,
    deleted: false
  };
  showMenu: boolean = false;

  isGoingToBeDeleted: boolean = false;

  constructor(public service: GroupsService, public overlayService: OverlayModalService, public router: Router) {
  }

  mute() {
    this.group['is:muted'] = true;

    this.service.muteNotifications(this.group)
      .then((isMuted: boolean) => {
        this.group['is:muted'] = isMuted;
      });

    this.showMenu = false;
  }

  unmute() {
    this.group['is:muted'] = true;

    this.service.unmuteNotifications(this.group)
      .then((isMuted: boolean) => {
        this.group['is:muted'] = isMuted;
      });

    this.showMenu = false;
  }

  report() {
    this.overlayService.create(ReportCreatorComponent, this.group)
      .present();
  }

  deletePrompt() {
    this.isGoingToBeDeleted = true;
  }

  cancelDelete() {
    this.isGoingToBeDeleted = false;
  }

  delete() {

    if (!this.isGoingToBeDeleted) {
      return;
    }

    this.group.deleted = true;

    this.service.deleteGroup(this.group)
      .then((deleted) => {
        this.group.deleted = deleted;

        if (deleted) {
          this.router.navigate(['/groups/member']);
        }
      });

    this.showMenu = false;
    this.isGoingToBeDeleted = false;
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

}
