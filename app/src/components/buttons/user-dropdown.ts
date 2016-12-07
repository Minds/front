import { Component, EventEmitter } from '@angular/core';

import { Client } from '../../services/api';
import { SessionFactory } from '../../services/session';

@Component({
  selector: 'minds-button-user-dropdown',
  inputs: ['user'],
  outputs: ['userChanged'],
  template: `
    <button class="material-icons" (click)="toggleMenu($event)">settings</button>

    <ul class="minds-dropdown-menu" [hidden]="!showMenu" >
      <li class="mdl-menu__item" [hidden]="user.blocked" (click)="block()" i18n>Block @{{user.username}}</li>
      <li class="mdl-menu__item" [hidden]="!user.blocked" (click)="unBlock()" i18n>Un-Block @{{user.username}}</li>
      <li class="mdl-menu__item" [hidden]="!user.subscribed" (click)="unSubscribe()" i18n>Un-subscribe</li>
      <li class="mdl-menu__item" *ngIf="session.isAdmin()" [hidden]="user.banned === 'yes'" (click)="banToggle = true; showMenu = false" i18n>Ban globally</li>
      <li class="mdl-menu__item" *ngIf="session.isAdmin()" [hidden]="user.banned !== 'yes'" (click)="unBan()" i18n>Un-ban globally</li>
    </ul>
    <minds-bg-overlay (click)="toggleMenu($event)" [hidden]="!showMenu"></minds-bg-overlay>

    <m-modal-confirm *ngIf="banToggle"
      [open]="true"
      [closeAfterAction]="true"
      (closed)="banToggle = false"
      (actioned)="ban($event)"
      yesButton="Ban user"
    >
      <p confirm-message>
          Are you sure you want to ban this user?<br><br>
          This will close all open sessions and lock him/her out from Minds.
      </p>
      <p confirm-success-message>
          User has been banned.
      </p>
    </m-modal-confirm>
  `
})

export class UserDropdownButton{

  user : any = {
    blocked: false
  };
  userChanged: EventEmitter<any> = new EventEmitter;
  showMenu : boolean = false;
  banToggle: boolean = false;

  session = SessionFactory.build();

  constructor(public client : Client) {
  }

  block(){
    var self = this;
    this.user.blocked = true;
    this.client.put('api/v1/block/' + this.user.guid, {})
      .then((response : any) => {
        self.user.blocked = true;
      })
      .catch((e) => {
        self.user.blocked = false;
      });
    this.showMenu = false;
  }

  unBlock(){
    var self = this;
    this.user.blocked = false;
    this.client.delete('api/v1/block/' + this.user.guid, {})
      .then((response : any) => {
        self.user.blocked = false;
      })
      .catch((e) => {
        self.user.blocked = true;
      });
    this.showMenu = false;
  }

  unSubscribe(){
    this.user.subscribed = false;
    this.client.delete('api/v1/subscribe/' + this.user.guid, {})
      .then((response : any) => {
          this.user.subscribed = false;
      })
      .catch((e) => {
        this.user.subscribed = true;
      });
  }

  ban() {
    this.user.banned = 'yes';
    this.client.put(`api/v1/admin/ban/${this.user.guid}`, {})
      .then(() => {
        this.user.banned = 'yes';
      })
      .catch(e => {
        this.user.banned = 'no';
      });

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

  toggleMenu(e){
    e.stopPropagation();
    if(this.showMenu){
      this.showMenu = false;

      return;
    }
    this.showMenu = true;
    var self = this;
    this.client.get('api/v1/block/' + this.user.guid)
      .then((response : any) => {
        self.user.blocked = response.blocked;
      })
  }

  ngOnDestroy(){
  }

}
