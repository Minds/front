import { forwardRef, Component, View, ChangeDetectionStrategy } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { SessionFactory } from '../../services/session';
import { Client } from '../../services/api';
import { SignupModalService } from '../modal/signup/service';
import { RemindComposerModal } from '../modal/modal';

@Component({
  selector: 'minds-button-remind',
  properties: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@View({
  template: `
    <a class="mdl-color-text--blue-grey-500" (click)="remind()" [ngClass]="{'selected': object.reminded }">
      <i class="material-icons">repeat</i>
      <counter *ngIf="object.reminds > 0">{{object.reminds}}</counter>
    </a>

    <m-modal-remind-composer *ngIf="remindOpen"
    [object]="object"
    [open]="true"
    [default]="message"
    (closed)="remindOpen = false"
    (post)="send($event)"
    ></m-modal-remind-composer>
  `,
  directives: [ CORE_DIRECTIVES, forwardRef(() => RemindComposerModal) ]
})

export class RemindButton {

  object;
  showModal : boolean = false;
  session = SessionFactory.build();
  message: string = '';
  remindOpen: boolean = false;

  constructor(public client : Client, private modal : SignupModalService) {
  }

  set _object(value : any){
    this.object = value;

    if (this.object) {
      if (this.object.remind_object && this.object.remind_object.owner_guid != this.session.getLoggedInUser().guid) {
        this.message = `via @${this.object.remind_object.ownerObj.username}`;
      } else if (this.object.owner_guid != this.session.getLoggedInUser().guid) {
        this.message = `via @${this.object.ownerObj.username}`;
      }
    }
  }

  remind(){
    var self = this;

    if (this.object.reminded)
      return false;

    if(!this.session.isLoggedIn()){
      this.modal.open();
      return false;
    }

    this.remindOpen = true;
  }

  send($event) {
    if ($event.message) {
      this.message = $event.message;
    }

    this.object.reminded = true;
    this.object.reminds++;

    this.client.post('api/v1/newsfeed/remind/' + this.object.guid, {
      message: this.message
    })
    .catch(e => {
      this.object.reminded = false;
      this.object.reminds--;
    });
  }

}
