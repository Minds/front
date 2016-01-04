import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { SessionFactory } from '../../services/session';
import { Client } from '../../services/api';
import { SignupOnActionModal } from '../modal/modal';

@Component({
  selector: 'minds-button-subscribe',
  properties: ['user']
})
@View({
  template: `
    <button class="minds-subscribe-button" *ngIf="!_user.subscribed" (click)="subscribe()">Subscribe</button> \
    <button class="minds-subscribe-button subscribed" *ngIf="_user.subscribed" (click)="unSubscribe()">Subscribed</button>
    <m-modal-signup-on-action [open]="showModal" (closed)="showModal = false" action="subscribe"  *ngIf="!session.isLoggedIn()"></m-modal-signup-on-action>
  `,
  directives: [ CORE_DIRECTIVES, SignupOnActionModal ]
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

  constructor(public client : Client) {
  }

  set user(value : any){
    this._user = value;
  }

  subscribe(){
    var self = this;

    if(!this.session.isLoggedIn()){
      this.showModal = true;
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
