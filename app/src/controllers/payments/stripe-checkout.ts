import { Component, EventEmitter, Input } from '@angular/core';

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

    <div class="m-payments--stripe-cards" *ngIf="cards.length">
      <div class="m-payments--stripe-card" *ngFor="let card of cards" (click)="selectSavedCard(card)">
        <div class="m-payments--stripe-card-type mdl-color-text--blue-grey-700">{{card.brand}}</div>
        <div class="m-payments--stripe-card-number mdl-color-text--blue-grey-500">**** {{card.last4}}</div>
        <div class="m-payments--stripe-card-expiry mdl-color-text--blue-grey-500">{{card.exp_month}} / {{card.exp_year}}</div>

        <div class="m-payments--stripe-card-select">Select</div>
      </div>

      <div class="m-payments--stripe-or">- OR -</div>
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
  cards : Array<any> = [];

  inputed : EventEmitter<any> = new EventEmitter;
  done : EventEmitter<any> = new EventEmitter;

  @Input() amount : number = 0;
  @Input() merchant_guid;
  @Input() gateway : string = "merchants";

  stripe;
  bt_checkout;
  token : string = "";

  @Input() useCreditCard : boolean = true;
  @Input() useBitcoin : boolean = false;

	constructor(public client: Client){
	}

  ngOnInit(){
    (<any>window).Stripe.setPublishableKey(this.minds.stripe_key);
    this.getSavedCards();
  }

  setCard(card){
    console.log(card);
    this.card = card;
    this.getCardToken();
  }

  getCardToken(){
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
      this.token = response.id;
      this.inputed.next(this.token);
      this.inProgress = false;

    });
  }

  getSavedCards(){
    this.client.get('api/v1/payments/stripe/cards')
      .then((response : any) => {
        this.cards = response.cards;
      });
  }

  selectSavedCard(card){
    this.inputed.next(card.id);
    this.inProgress = true;
  }

  purchase(){

  }

  ngOnDestroy(){
  }

}
