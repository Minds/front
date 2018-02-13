import { Component } from '@angular/core';

import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';

@Component({
  selector: 'minds-button-monetize',
  inputs: ['_object: object'],
  host: {
    '(click)': 'monetize()',
    'class': 'm-button'
  },
  template: `
    <button class="m-btn m-btn--with-icon" [ngClass]="{'selected': isMonetized }">
      <i class="material-icons">attach_money</i>
    </button>
  `
})

export class MonetizeButton {

  object;
  isMonetized = false;

  constructor(public session: Session, public client: Client) {
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
