import { Component, EventEmitter } from '@angular/core';

import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { BanModalComponent } from '../../../ban/modal/modal.component';
import { ReportCreatorComponent } from '../../../report/creator/creator.component';

@Component({
  selector: 'minds-button-user-dropdown',
  inputs: ['user'],
  outputs: ['userChanged'],
  template: `
    <button class="material-icons" (click)="toggleMenu($event)">settings</button>

    <ul class="minds-dropdown-menu" [hidden]="!showMenu" >
      <li class="mdl-menu__item" [hidden]="user.blocked" (click)="block()" i18n="@@MINDS__BUTTONS__USER_DROPDOWN__BLOCK">Block @{{user.username}}</li>
      <li class="mdl-menu__item" [hidden]="!user.blocked" (click)="unBlock()" i18n="@@MINDS__BUTTONS__USER_DROPDOWN__UNBLOCK">Un-Block @{{user.username}}</li>
      <li class="mdl-menu__item" [hidden]="!user.subscribed" (click)="unSubscribe()" i18n="@@MINDS__BUTTONS__USER_DROPDOWN__UNSUBSCRIBE">Unsubscribe</li>
      <li class="mdl-menu__item"
        *ngIf="session.isAdmin()"
        [hidden]="user.banned === 'yes'"
        (click)="banToggle = true; showMenu = false"
        i18n="@@MINDS__BUTTONS__USER_DROPDOWN__BAN_GLOBALLY"
        >
        Ban globally
      </li>
      <li class="mdl-menu__item" *ngIf="session.isAdmin()" [hidden]="user.banned !== 'yes'" (click)="unBan()" i18n="@@MINDS__BUTTONS__USER_DROPDOWN__UNBAN_GLOBALLY">Un-ban globally</li>
      <li class="mdl-menu__item"
        *ngIf="session.isAdmin()"
        [hidden]="user.ban_monetization === 'yes'"
        (click)="banMonetizationToggle = true; showMenu = false"
        i18n="@@MINDS__BUTTONS__USER_DROPDOWN__BAN_FROM_MONETIZATION"
        >
        Ban from Monetization
      </li>
      <li class="mdl-menu__item"
        *ngIf="session.isAdmin()"
        [hidden]="user.ban_monetization !== 'yes'"
        (click)="unBanMonetization()"
        i18n="@@MINDS__BUTTONS__USER_DROPDOWN__UNBAN_FROM_MONETIZATION"
        >
        Un-ban from Monetization
      </li>
      <li class="mdl-menu__item"
        (click)="report(); showMenu = false"
        i18n="@@M__ACTION__REPORT"
      >
        Report
      </li>
      <li class="mdl-menu__item"
        *ngIf="session.isAdmin()"
        [hidden]="user.spam"
        (click)="setSpam(true); showMenu = false"
        i18n="@@M__ACTION__MARK_SPAM"
        >
        Mark as spam
      </li>
      <li class="mdl-menu__item"
        *ngIf="session.isAdmin()"
        [hidden]="!user.spam"
        (click)="setSpam(false); showMenu = false"
        i18n="@@M__ACTION__NOT_SPAM"
        >
        Not spam
      </li>
      <ng-container *ngIf="session.isAdmin()">
        <li class="mdl-menu__item" [hidden]="user.rating === 1" (click)="setRating(1)" i18n="@@M__ACTION__MARK_AS_SAFE">Mark as Safe</li>
        <li class="mdl-menu__item" [hidden]="user.rating === 2" (click)="setRating(2)" i18n="@@M__ACTION__MENU__MARK_AS_OPEN">Mark as Open</li>
      </ng-container>
    </ul>
    <div class="minds-bg-overlay" (click)="toggleMenu($event)" [hidden]="!showMenu"></div>

    <m-modal-confirm *ngIf="banToggle"
      [open]="true"
      [closeAfterAction]="true"
      (closed)="banToggle = false"
      (actioned)="ban()"
      yesButton="Ban user"
      i18n-yesButton="@@M__ACTION__BAN_USER"
    >
      <p confirm-message i18n="@@MINDS__BUTTONS__USER_DROPDOWN__BAN_USER_CONFIRM_MESSAGE">
          Are you sure you want to ban this user?<br><br>
          This will close all open sessions and lock him/her out from Minds.
      </p>
      <p confirm-success-message i18n="@@MINDS__BUTTONS__USER_DROPDOWN__BAN_USER_SUCCESS_MESSAGE">
          User has been banned.
      </p>
    </m-modal-confirm>
    <m-modal-confirm *ngIf="banMonetizationToggle"
      [open]="true"
      [closeAfterAction]="true"
      (closed)="banMonetizationToggle = false"
      (actioned)="banMonetization()"
      yesButton="Ban user"
      i18n-yesButton="@@M__ACTION__BAN_USER"
    >
      <p confirm-message i18n="@@MINDS__BUTTONS__USER_DROPDOWN__BAN_MONETIZATION_CONFIRM_MESSAGE">
          Are you sure you want to ban this user from monetization?<br><br>
          This will close all open sessions and decline pending payments.<br>
          There's no UNDO. This will NOT ban the user from Minds.
      </p>
      <p confirm-success-message i18n="@@MINDS__BUTTONS__USER_DROPDOWN__BAN_MONETIZATION_SUCCESS_MESSAGE">
          User has been banned from monetization.
      </p>
    </m-modal-confirm>
  `
})

export class UserDropdownButton {

  user: any = {
    blocked: false
  };
  userChanged: EventEmitter<any> = new EventEmitter;
  showMenu: boolean = false;
  banToggle: boolean = false;
  banMonetizationToggle: boolean = false;

  constructor(public session: Session, public client: Client, public overlayService: OverlayModalService) {
  }

  block() {
    var self = this;
    this.user.blocked = true;
    this.client.put('api/v1/block/' + this.user.guid, {})
      .then((response: any) => {
        self.user.blocked = true;
      })
      .catch((e) => {
        self.user.blocked = false;
      });
    this.showMenu = false;
  }

  unBlock() {
    var self = this;
    this.user.blocked = false;
    this.client.delete('api/v1/block/' + this.user.guid, {})
      .then((response: any) => {
        self.user.blocked = false;
      })
      .catch((e) => {
        self.user.blocked = true;
      });
    this.showMenu = false;
  }

  unSubscribe() {
    this.user.subscribed = false;
    this.client.delete('api/v1/subscribe/' + this.user.guid, {})
      .then((response: any) => {
        this.user.subscribed = false;
      })
      .catch((e) => {
        this.user.subscribed = true;
      });
  }

  ban() {
    this.user.banned = 'yes';
    this.overlayService.create(BanModalComponent, this.user)
      .present();

    this.banToggle = false;
  }

  unBan() {
    this.user.banned = 'no';
    this.client.delete(`api/v1/admin/ban/${this.user.guid}`, {})
      .then(() => {
        this.user.banned = 'no';
      })
      .catch(e => {
        this.user.banned = 'yes';
      });

    this.showMenu = false;
  }

  banMonetization() {
    this.user.ban_monetization = 'yes';
    this.client.put(`api/v1/admin/monetization/ban/${this.user.guid}`, {})
      .then(() => {
        this.user.ban_monetization = 'yes';
      })
      .catch(e => {
        this.user.ban_monetization = 'no';
      });

    this.banMonetizationToggle = false;
  }

  unBanMonetization() {
    this.user.ban_monetization = 'no';
    this.client.delete(`api/v1/admin/monetization/ban/${this.user.guid}`, {})
      .then(() => {
        this.user.ban_monetization = 'no';
      })
      .catch(e => {
        this.user.ban_monetization = 'yes';
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
    var self = this;
    this.client.get('api/v1/block/' + this.user.guid)
      .then((response: any) => {
        self.user.blocked = response.blocked;
      });

    if (this.session.isAdmin()) {
      this.client.get(`api/v1/admin/monetization/ban/${this.user.guid}`)
        .then((response: any) => {
          if (typeof response.banned !== 'undefined') {
            self.user.ban_monetization = response.banned ? 'yes' : 'no';
          }
        });
    }
  }

  report() {
    this.overlayService.create(ReportCreatorComponent, this.user)
      .present();
  }

  async setSpam(value: boolean) {
    this.user['spam'] = value ? 1 : 0;

    try {
      if (value) {
        await this.client.put(`api/v1/admin/spam/${this.user.guid}`);
      } else {
        await this.client.delete(`api/v1/admin/spam/${this.user.guid}`);
      }
    } catch (e) {
      this.user['spam'] = !value ? 1 : 0;
    }
  }

  async setRating(rating: number) {
    await this.client.post(`api/v1/admin/rating/${this.user.guid}/${rating}`, {});
    this.user.rating = rating;
  }

}
