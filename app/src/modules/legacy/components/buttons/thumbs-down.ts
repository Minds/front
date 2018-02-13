import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { WalletService } from '../../../../services/wallet';
import { SignupModalService } from '../../../../modules/modals/signup/service';

@Component({
  selector: 'minds-button-thumbs-down',
  inputs: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="mdl-color-text--blue-grey-500" (click)="thumb()" [ngClass]="{'selected': has() }">
      <i class="material-icons">thumb_down</i>
      <span class="minds-counter" *ngIf="object['thumbs:down:count'] > 0">{{object['thumbs:down:count'] | number}}</span>
    </a>
  `
})

export class ThumbsDownButton {

  object;
  showModal: boolean = false;

  constructor(public session: Session, public client: Client, public wallet: WalletService, private modal: SignupModalService) {
  }

  set _object(value: any) {
    this.object = value;
    if (!this.object['thumbs:down:user_guids'])
      this.object['thumbs:down:user_guids'] = [];
  }

  thumb() {
    var self = this;

    if (!this.session.isLoggedIn()) {
      this.modal.setSubtitle('You need to have a channel to vote').open();
      return false;
    }

    this.client.put('api/v1/thumbs/' + this.object.guid + '/down', {});
    if (!this.has()) {
      //this.object['thumbs:down:user_guids'].push(this.session.getLoggedInUser().guid);
      this.object['thumbs:down:user_guids'] = [this.session.getLoggedInUser().guid];
      this.object['thumbs:down:count']++;
    } else {
      for (let key in this.object['thumbs:down:user_guids']) {
        if (this.object['thumbs:down:user_guids'][key] === this.session.getLoggedInUser().guid)
          delete this.object['thumbs:down:user_guids'][key];
      }
      this.object['thumbs:down:count']--;
    }
  }

  has() {
    for (var guid of this.object['thumbs:down:user_guids']) {
      if (guid === this.session.getLoggedInUser().guid)
        return true;
    }
    return false;
  }

}
