import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { SessionFactory } from '../../services/session';
import { Client } from '../../services/api';
import { WalletService } from '../../services/wallet';
import { SignupOnActionModal } from '../modal/modal';

@Component({
  selector: 'minds-button-thumbs-up',
  viewBindings: [ Client, WalletService ],
  properties: ['_object: object']
})
@View({
  template: `
    <a class="mdl-color-text--blue-grey-500" (click)="thumb()" [ngClass]="{'selected': has() }">
      <i class="material-icons">thumb_up</i>
      <counter *ngIf="object['thumbs:up:count'] > 0">{{object['thumbs:up:count']}}</counter>
    </a>
    <m-modal-signup-on-action [open]="showModal" (closed)="showModal = false" action="vote up"  *ngIf="!session.isLoggedIn()"></m-modal-signup-on-action>
  `,
  directives: [CORE_DIRECTIVES, SignupOnActionModal]
})

export class ThumbsUpButton {

  object = {
    'guid': null,
    'thumbs:up:user_guids': []
  };
  session = SessionFactory.build();
  showModal : boolean = false;

  constructor(public client : Client, public wallet : WalletService) {
  }

  set _object(value : any){
    if(!value)
      return;
    this.object = value;
    if(!this.object['thumbs:up:user_guids'])
      this.object['thumbs:up:user_guids'] = [];
  }

  thumb(){
    var self = this;

    if(!this.session.isLoggedIn()){
      this.showModal = true;
      return false;
    }

    this.client.put('api/v1/thumbs/' + this.object.guid + '/up', {});
    if(!this.has()){
      //this.object['thumbs:up:user_guids'].push(this.session.getLoggedInUser().guid);
      this.object['thumbs:up:user_guids'] = [this.session.getLoggedInUser().guid];
      this.object['thumbs:up:count']++;
      self.wallet.increment();
    } else {
      for(let key in this.object['thumbs:up:user_guids']){
        if(this.object['thumbs:up:user_guids'][key] == this.session.getLoggedInUser().guid)
          delete this.object['thumbs:up:user_guids'][key];
      }
      this.object['thumbs:up:count']--;
      self.wallet.decrement();
    }
  }

  has(){
    for(var guid of this.object['thumbs:up:user_guids']){
      if(guid == this.session.getLoggedInUser().guid)
        return true;
    }
    return false;
  }

}
