import { Component, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../services/api';
import { WalletService } from '../../services/wallet';
import { Storage } from '../../services/storage';


interface CreditCard {
  number?: number,
  type?: string,
  name?: string,
  sec?: number,
  month?: number | string,
  year?: number | string
}

@Component({
  moduleId: module.id,
  selector: 'minds-payments-stripe-checkout',
  outputs: ['inputed', 'done'],
  template: `
    <div class="m-error mdl-color--red mdl-color-text--white" *ngIf="error">
        {{error}}
    </div>
    <div class="mdl-card m-payments-options" style="margin-bottom:8px;" *ngIf="useBitcoin">
        <div id="coinbase-btn" *ngIf="useBitcoin"></div>
    </div>

    <minds-checkout-card-input (confirm)="setCard($event)" [hidden]="inProgress || confirmation" *ngIf="useCreditCard"></minds-checkout-card-input>
    <div [hidden]="!inProgress" class="m-checkout-loading">
      <div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active" style="margin:auto; display:block;" [mdl]></div>
      <p>Capturing card details...</p>
    </div>
  `
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

	constructor(public client: Client, private cd: ChangeDetectorRef){
	}

  ngOnInit(){
    setTimeout(() => {
      this.setupStripe();
    }, 1000); //sometimes stripe can take a while to download
  }

  setupStripe(){
    if((<any>window).Stripe){
      (<any>window).Stripe.setPublishableKey(this.minds.stripe_key);
    }
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
        this.cd.markForCheck();
        this.cd.detectChanges();
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
