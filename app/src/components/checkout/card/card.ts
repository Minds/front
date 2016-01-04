import { Component, View, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';

import { Client } from '../../../services/api';
import { MDL_DIRECTIVES } from '../../../directives/material';

import { CreditCard } from '../../../interfaces/card-interface';

@Component({
  selector: 'minds-checkout-card-input',
  outputs: ['_confirm: confirm']
})
@View({
  templateUrl: 'src/components/checkout/card/card.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, MDL_DIRECTIVES]
})

export class CardInput {

  _confirm : EventEmitter<any> = new EventEmitter();
  card : CreditCard = <CreditCard>{ month: 'mm', year: 'yyyy'};
  inProgress : boolean = false;

  constructor(public client : Client) {
  }

  validate(){

    if(!this.card.number || !this.card.sec || !this.card.name)
      return false;

    if(this.card.month == 'mm' || this.card.year == 'yyyy')
      return false;

    return true;
  }

  confirm(){
    this._confirm.next(this.card);
  }

}
