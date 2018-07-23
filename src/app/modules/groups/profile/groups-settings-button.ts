import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { GroupsService } from '../groups-service';
import { ReportCreatorComponent } from '../../report/creator/creator.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';

@Component({
  selector: 'minds-groups-settings-button',
  template: `
    <button class="material-icons" (click)="toggleMenu($event)">
      settings
      <i *ngIf="group['is:muted']" class="minds-groups-button-badge material-icons">notifications_off</i>
    </button>

    <ul class="minds-dropdown-menu" [hidden]="!showMenu" >
      <li class="mdl-menu__item" [hidden]="group['is:muted']" (click)="mute()" i18n="@@GROUPS__PROFILE__GROUP_SETTINGS_BTN__DISABLE_NOTIFICATIONS">Disable Notifications</li>
      <li class="mdl-menu__item" [hidden]="!group['is:muted']" (click)="unmute()" i18n="@@GROUPS__PROFILE__GROUP_SETTINGS_BTN__ENABLE_NOTIFICATIONS">Enable Notifications</li>
      <li class="mdl-menu__item" *ngIf="session.isAdmin() && !featured" (click)="openFeatureModal()" i18n="@@M__ACTION__FEATURE">Feature</li>
      <li class="mdl-menu__item" *ngIf="session.isAdmin() && featured" (click)="unfeature()" i18n="@@M__ACTION__UNFEATURE">Unfeature</li>
      <li class="mdl-menu__item" *ngIf="session.isAdmin() && !group.mature" (click)="setExplicit(true)" i18n="@@M__ACTION__SET_EXPLICIT">Set Explicit</li>
      <li class="mdl-menu__item" *ngIf="session.isAdmin() && group.mature" (click)="setExplicit(false)" i18n="@@M__ACTION__REMOVE_EXPLICIT">Remove Explicit</li>
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

    <m-modal [open]="featureModalOpen" (closed)="onFeatureModalClose($event)">
      <div class="m-button-feature-modal">
        <select [(ngModel)]="category">
          <option value="not-selected" i18n="@@M__COMMON__SELECT_A_CATEGORY">-- SELECT A CATEGORY --</option>
          <option *ngFor="let category of categories" [value]="category.id">{{category.label}}</option>
        </select>

        <button class="mdl-button mdl-button--colored" (click)="feature()" i18n="@@M__ACTION__FEATURE">Feature</button>
      </div>
    </m-modal>
  `
})

export class GroupsSettingsButton {

  group: any = {
    'is:muted': false,
    deleted: false
  };

  @Input('group') set _group(value: any) {
    if (!value) return;
    this.group = value;
    this.featured = value.featured_id || value.featured === true;
  }

  showMenu: boolean = false;

  isGoingToBeDeleted: boolean = false;

  categories: Array<any> = [];
  category: string = 'not-selected';

  featured: boolean = false;

  featureModalOpen: boolean = false;

  constructor(public service: GroupsService, public client: Client, public session: Session, public overlayService: OverlayModalService, public router: Router) {
  }

  ngOnInit() {
    this.initCategories();
  }

  initCategories() {
    for (let category in window.Minds.categories) {
      this.categories.push({
        id: category,
        label: window.Minds.categories[category],
      });
    }
  }

  async mute() {
    this.group['is:muted'] = true;

    try {
      const isMuted: boolean = await this.service.muteNotifications(this.group)
      this.group['is:muted'] = isMuted;
    } catch (e) {
      this.group['is:muted'] = false;
    }

    this.showMenu = false;
  }

  async unmute() {
    this.group['is:muted'] = false;

    try {
      const isMuted: boolean = await this.service.unmuteNotifications(this.group);
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
      await this.client.put(`api/v1/admin/feature/${this.group.guid}/${this.category}`, {})
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
    this.overlayService.create(ReportCreatorComponent, this.group)
      .present();
  }

  deletePrompt() {
    this.isGoingToBeDeleted = true;
  }

  cancelDelete() {
    this.isGoingToBeDeleted = false;
  }

  setExplicit(value) {
    this.service.setExplicit(this.group.guid, value)
      .then(result => {
        if (result) {
          this.group.mature = value;
        }
      });
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
