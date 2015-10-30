import { Component, View, CORE_DIRECTIVES, FORM_DIRECTIVES, EventEmitter } from 'angular2/angular2';
import { Client } from "src/services/api";
import { MDL_DIRECTIVES } from 'src/directives/material';



interface CreditCard {
  number?: number,
  type?: string,
  name?: string,
  name2?: string,
  sec?: number,
  month?: number | string,
  year?: number | string
}

@Component({
  selector: 'minds-checkout-card-input',
  outputs: ['_confirm: confirm']
})
@View({
  templateUrl: 'src/components/checkout/card/card.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, MDL_DIRECTIVES]
})

export class CardInput {

  _confirm : EventEmitter = new EventEmitter;
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
