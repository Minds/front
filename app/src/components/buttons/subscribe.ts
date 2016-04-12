import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { SessionFactory } from '../../services/session';
import { Client } from '../../services/api';
import { SignupModalService } from '../modal/signup/service';

@Component({
  selector: 'minds-button-subscribe',
  properties: ['user'],
  template: `
    <button class="minds-subscribe-button" *ngIf="!_user.subscribed" (click)="subscribe()">
      <i class="material-icons">person_add</i>
      Subscribe
    </button>
    <button class="minds-subscribe-button subscribed" *ngIf="_user.subscribed" (click)="unSubscribe()">
      <i class="material-icons">person_add</i>
      Subscribed
    </button>
  `,
  directives: [ CORE_DIRECTIVES ]
})

export class SubscribeButton{

  _user : any = {
    subscribed: false
  };
  _inprogress : boolean = false;
  _content : any;
  _listener : Function;
  showModal : boolean = false;
  session = SessionFactory.build();

  constructor(public client : Client, public modal : SignupModalService) {
  }

  set user(value : any){
    this._user = value;
  }

  subscribe(){
    var self = this;

    if(!this.session.isLoggedIn()){
      this.modal.setSubtitle('You need to have a channel in order to subscribe').open();
      return false;
    }

    this._user.subscribed = true;
    this.client.post('api/v1/subscribe/' + this._user.guid, {})
      .then((response : any) => {
          this._user.subscribed = true;
      })
      .catch((e) => {
        this._user.subscribed = false;
      });
  }

  unSubscribe(){
    var self = this;
    this._user.subscribed = false;
    this.client.delete('api/v1/subscribe/' + this._user.guid, {})
      .then((response : any) => {
          this._user.subscribed = false;
      })
      .catch((e) => {
        this._user.subscribed = true;
      });
  }

  ngOnDestroy(){
  }

}
