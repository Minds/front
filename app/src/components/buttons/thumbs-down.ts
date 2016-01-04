import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { SessionFactory } from '../../services/session';
import { Client } from '../../services/api';
import { WalletService } from '../../services/wallet';
import { SignupOnActionModal } from '../modal/modal';

@Component({
  selector: 'minds-button-thumbs-down',
  viewBindings: [ Client, WalletService ],
  properties: ['_object: object']
})
@View({
  template: `
    <a class="mdl-color-text--blue-grey-500" (click)="thumb()" [ngClass]="{'selected': has() }">
      <i class="material-icons">thumb_down</i>
      <counter *ngIf="object['thumbs:down:count'] > 0">{{object['thumbs:down:count']}}</counter>
    </a>
    <m-modal-signup-on-action [open]="showModal" (closed)="showModal = false" action="vote down" *ngIf="!session.isLoggedIn()"></m-modal-signup-on-action>
  `,
  directives: [CORE_DIRECTIVES, SignupOnActionModal]
})

export class ThumbsDownButton {

  object;
  session = SessionFactory.build();
  showModal : boolean = false;

  constructor(public client : Client, public wallet : WalletService) {
  }

  set _object(value : any){
    this.object = value;
    if(!this.object['thumbs:down:user_guids'])
      this.object['thumbs:down:user_guids'] = [];
  }

  thumb(){
    var self = this;

    if(!this.session.isLoggedIn()){
      this.showModal = true;
      return false;
    }

    this.client.put('api/v1/thumbs/' + this.object.guid + '/down', {});
    if(!this.has()){
      //this.object['thumbs:down:user_guids'].push(this.session.getLoggedInUser().guid);
      this.object['thumbs:down:user_guids'] = [this.session.getLoggedInUser().guid];
      this.object['thumbs:down:count']++;
      self.wallet.increment();
    } else {
      for(let key in this.object['thumbs:down:user_guids']){
        if(this.object['thumbs:down:user_guids'][key] == this.session.getLoggedInUser().guid)
          delete this.object['thumbs:down:user_guids'][key];
      }
      this.object['thumbs:down:count']--;
      self.wallet.decrement();
    }
  }

  has(){
    for(var guid of this.object['thumbs:down:user_guids']){
      if(guid == this.session.getLoggedInUser().guid)
        return true;
    }
    return false;
  }

}
