import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { Client } from '../../services/api';

@Component({
  selector: 'minds-button-comment',
  properties: ['_object: object']
})
@View({
  template: `
    <a class="mdl-color-text--blue-grey-500" [ngClass]="{'selected': object['comments:count'] > 0 }">
      <i class="material-icons">chat_bubble</i>
      <counter *ngIf="object['comments:count'] > 0">{{object['comments:count']}}</counter>
    </a>
  `,
  directives: [CORE_DIRECTIVES]
})

export class CommentButton {

  object;

  constructor(public client : Client) {
  }

  set _object(value : any){
    this.object = value;
  }

}
