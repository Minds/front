import { Component, EventEmitter } from '@angular/core';

import { CreditCard } from "../../../interfaces/card-interface";

import { Client } from "../../../services/api";

@Component({
  moduleId: module.id,
  selector: 'minds-checkout-card-input',
  outputs: ['_confirm: confirm'],
  templateUrl: 'card.html'
})

export class CardInput {

  _confirm: EventEmitter<any> = new EventEmitter();
  card: CreditCard = <CreditCard>{ month: 'mm', year: 'yyyy' };
  inProgress: boolean = false;
  confirmation: boolean = false; // @todo: ??
  error: string = ''; // @todo: ??
  years: Array<number> = [];


  constructor(public client: Client) {
    let start: number = new Date().getFullYear();
    for (let i = 0; i < 19; i++) {
      this.years[i] = start;
      start++;
    }
  }

  validate() {

    if (!this.card.number || !this.card.sec || !this.card.name)
      return false;

    if (this.card.month == 'mm' || this.card.year == 'yyyy')
      return false;

    return true;
  }

  confirm() {
    this._confirm.next(this.card);
  }

}
