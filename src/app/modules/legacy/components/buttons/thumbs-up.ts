import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { WalletService } from '../../../../services/wallet';
import { SignupModalService } from '../../../../modules/modals/signup/service';


@Component({
  selector: 'minds-button-thumbs-up',
  inputs: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="mdl-color-text--blue-grey-500" (click)="thumb()" [ngClass]="{'selected': has() }">
      <i class="material-icons">thumb_up</i>
      <span class="minds-counter" *ngIf="object['thumbs:up:count'] > 0">{{object['thumbs:up:count'] | number}}</span>
    </a>
  `
})

export class ThumbsUpButton {

  object = {
    'guid': null,
    'owner_guid': null,
    'thumbs:up:user_guids': []
  };
  showModal: boolean = false;

  constructor(public session: Session, public client: Client, public wallet: WalletService, private modal: SignupModalService) {
  }

  set _object(value: any) {
    if (!value)
      return;
    this.object = value;
    if (!this.object['thumbs:up:user_guids'])
      this.object['thumbs:up:user_guids'] = [];
  }

  thumb() {
    var self = this;

    if (!this.session.isLoggedIn()) {
      this.modal.setSubtitle('You need to have a channel to vote').open();
      this.showModal = true;
      return false;
    }

    this.client.put('api/v1/thumbs/' + this.object.guid + '/up', {});
    if (!this.has()) {
      //this.object['thumbs:up:user_guids'].push(this.session.getLoggedInUser().guid);
      this.object['thumbs:up:user_guids'] = [this.session.getLoggedInUser().guid];
      this.object['thumbs:up:count']++;
    } else {
      for (let key in this.object['thumbs:up:user_guids']) {
        if (this.object['thumbs:up:user_guids'][key] === this.session.getLoggedInUser().guid)
          delete this.object['thumbs:up:user_guids'][key];
      }
      this.object['thumbs:up:count']--;
    }
  }

  has() {
    for (var guid of this.object['thumbs:up:user_guids']) {
      if (guid === this.session.getLoggedInUser().guid)
        return true;
    }
    return false;
  }

}
