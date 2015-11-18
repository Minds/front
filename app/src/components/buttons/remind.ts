import { Component, View, CORE_DIRECTIVES } from 'angular2/angular2';
import { SessionFactory } from '../../services/session';
import { Client } from '../../services/api';
import { SignupOnActionModal } from '../modal/modal';

@Component({
  selector: 'minds-button-remind',
  properties: ['_object: object']
})
@View({
  template: `
    <a class="mdl-color-text--blue-grey-500" (click)="remind()" [ng-class]="{'selected': object.reminded }">
      <i class="material-icons">repeat</i>
      <counter *ng-if="object.reminds > 0">{{object.reminds}}</counter>
    </a>
    <m-modal-signup-on-action [open]="showModal" (closed)="showModal = false" action="remind" *ng-if="!session.isLoggedIn()"></m-modal-signup-on-action>
  `,
  directives: [CORE_DIRECTIVES, SignupOnActionModal]
})

export class RemindButton {

  object;
  showModal : boolean = false;
  session = SessionFactory.build();

  constructor(public client : Client) {
  }

  set _object(value : any){
    this.object = value;
  }

  remind(){
    var self = this;

    if (this.object.reminded)
      return false;

    if(!this.session.isLoggedIn()){
      this.showModal = true;
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
