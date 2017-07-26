import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Client } from '../../../../services/api';

@Component({
  selector: 'minds-button-comment',
  inputs: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="mdl-color-text--blue-grey-500" [ngClass]="{'selected': object['comments:count'] > 0 }">
      <i class="material-icons">chat_bubble</i>
      <span class="minds-counter" *ngIf="object['comments:count'] > 0">{{object['comments:count'] | number}}</span>
    </a>
  `
})

export class CommentButton {

  object;

  constructor(public client : Client) {
  }

  set _object(value : any){
    this.object = value;
  }

}
