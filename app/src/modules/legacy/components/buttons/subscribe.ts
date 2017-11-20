import { Component } from '@angular/core';

import { SessionFactory } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { SignupModalService } from '../../../../modules/modals/signup/service';

@Component({
  selector: 'minds-button-subscribe',
  inputs: ['user'],
  template: `
    <button class="minds-subscribe-button" *ngIf="!_user.subscribed" (click)="subscribe()">
      <i class="material-icons">person_add</i>
      <!-- i18n: @@M__ACTION__SUBSCRIBE -->Subscribe<!-- /i18n -->
    </button>
    <button class="minds-subscribe-button subscribed" *ngIf="_user.subscribed" (click)="unSubscribe()">
      <i class="material-icons">person_add</i>
      <!-- i18n: @@MINDS__BUTTONS__SUBSCRIBE__SUBSCRIBED_LABEL -->Subscribed<!-- /i18n -->
    </button>
  `
})

export class SubscribeButton {

  _user: any = {
    subscribed: false
  };
  _inprogress: boolean = false;
  _content: any;
  _listener: Function;
  showModal: boolean = false;
  session = SessionFactory.build();

  constructor(public client: Client, public modal: SignupModalService) {
  }

  set user(value: any) {
    this._user = value;
  }

  subscribe() {
    var self = this;

    if (!this.session.isLoggedIn()) {
      this.modal.setSubtitle('You need to have a channel in order to subscribe').open();
      return false;
    }

    this._user.subscribed = true;
    this.client.post('api/v1/subscribe/' + this._user.guid, {})
      .then((response: any) => {
        if (response && response.error) {
          throw 'error';
        }

        this._user.subscribed = true;
      })
      .catch((e) => {
        this._user.subscribed = false;
        alert('You can\'t subscribe to this user.');
      });
  }

  unSubscribe() {
    var self = this;
    this._user.subscribed = false;
    this.client.delete('api/v1/subscribe/' + this._user.guid, {})
      .then((response: any) => {
        this._user.subscribed = false;
      })
      .catch((e) => {
        this._user.subscribed = true;
      });
  }

}
