import { Component } from '@angular/core';

import { SessionFactory } from '../../../../services/session';
import { Client } from '../../../../services/api';

@Component({
  selector: 'minds-button-monetize',
  inputs: ['_object: object'],
  host: {
    '(click)': 'monetize()',
    'class': 'm-button'
  },
  template: `
    <button class="material-icons" [ngClass]="{'selected': isMonetized }">
      <i class="material-icons">attach_money</i>
    </button>
  `
})

export class MonetizeButton {

  object;
  session = SessionFactory.build();
  isMonetized = false;

  constructor(public client: Client) {
  }

  set _object(value: any) {
    if (!value)
      return;
    this.object = value;
    this.isMonetized = value.monetized;
  }

  monetize() {
    if (this.isMonetized)
      return this.unMonetize();

    this.isMonetized = true;

    this.client.put('api/v1/monetize/' + this.object.guid, {})
      .catch((e) => {
        this.isMonetized = false;
      });
  }

  unMonetize() {
    this.isMonetized = false;
    this.object.monetized = false;
    this.client.delete('api/v1/monetize/' + this.object.guid, {})
      .catch((e) => {
        this.isMonetized = true;
      });
  }

}
