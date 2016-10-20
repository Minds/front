import { Component, EventEmitter, Input } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { RouterLink } from "@angular/router-deprecated";

import { Client } from '../../services/api';
import { WalletService } from '../../services/wallet';
import { Storage } from '../../services/storage';
import { MDL_DIRECTIVES } from '../../directives/material';
import { InfiniteScroll } from '../../directives/infinite-scroll';
import { CHECKOUT_COMPONENTS } from '../../components/checkout';


interface CreditCard {
  number?: number,
  type?: string,
  name?: string,
  sec?: number,
  month?: number | string,
  year?: number | string
}

@Component({
  selector: 'minds-payments-stripe-checkout',
  outputs: ['inputed', 'done'],
  template: `
    <div class="mdl-card m-payments-options" style="margin-bottom:8px;" *ngIf="usePayPal || useBitcoin">
        <div id="coinbase-btn" *ngIf="useBitcoin"></div>
    </div>

    <minds-checkout-card-input (confirm)="setCard($event)" [hidden]="inProgress || confirmation" *ngIf="useCreditCard"></minds-checkout-card-input>
    <div [hidden]="!inProgress" class="m-checkout-loading">
      <div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active" style="margin:auto; display:block;" [mdl]></div>
      <p>Capturing card details...</p>
    </div>
  `,
  directives: [ CORE_DIRECTIVES, MDL_DIRECTIVES, FORM_DIRECTIVES, CHECKOUT_COMPONENTS, InfiniteScroll ]
})

export class StripeCheckout {

  minds = window.Minds;
  inProgress : boolean = false;
  confirmation : boolean = false;
  error : string = "";
  card;

  inputed : EventEmitter<any> = new EventEmitter;
  done : EventEmitter<any> = new EventEmitter;

  @Input() amount : number = 0;
  @Input() merchant_guid;
  @Input() gateway : string = "merchants";

  stripe;
  bt_checkout;
  nonce : string = "";

  @Input() useCreditCard : boolean = true;
  @Input() useBitcoin : boolean = false;

	constructor(public client: Client){
	}

  ngOnInit(){
    (<any>window).Stripe.setPublishableKey(this.minds.stripe_key);
  }

  setCard(card){
    console.log(card);
    this.card = card;
    this.getCardNonce();
  }

  getCardNonce(){
    this.inProgress = true;

    (<any>window).Stripe.card.createToken({
      number: this.card.number,
      cvc: this.card.sec,
      exp_month: this.card.month,
      exp_year: this.card.year
    }, (status, response) => {

      if(response.error){
        this.error = response.error.message;
        this.inProgress = false;
        return false;
      }
      this.nonce = response.id;
      this.inputed.next(this.nonce);
      this.inProgress = false;

    });
  }

  purchase(){

  }

  ngOnDestroy(){
  }

}
