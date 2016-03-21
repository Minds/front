import { Component, View, ChangeDetectionStrategy } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { SessionFactory } from '../../services/session';
import { Client } from '../../services/api';
import { SignupModalService } from '../modal/signup/service';

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
  `,
  directives: [ CORE_DIRECTIVES ]
})

export class RemindButton {

  object;
  showModal : boolean = false;
  session = SessionFactory.build();

  constructor(public client : Client, private modal : SignupModalService) {
  }

  set _object(value : any){
    this.object = value;
  }

  remind(){
    var self = this;

    if (this.object.reminded)
      return false;

    if(!this.session.isLoggedIn()){
      this.modal.open();
      return false;
    }

    this.object.reminded = true;
    this.object.reminds++;

    this.client.post('api/v1/newsfeed/remind/' + this.object.guid, {})
      .then((response : any) => {

      })
      .catch((e) => {
        this.object.reminded = false;
        this.object.reminds--;
      });
  }

}
