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

    <div class="m-payments-options" style="margin-bottom:8px;" *ngIf="useBitcoin"
      [class.mdl-card]="useMDLStyling"
    >
      <div id="coinbase-btn" *ngIf="useBitcoin"></div>
    </div>

    <div class="m-payments-saved--title" *ngIf="cards.length">Select:</div>

    <ul class="m-payments-saved" *ngIf="cards.length">
      <li *ngFor="let card of cards"
        class="m-payments-saved--item"
        (click)="setSavedCard(card.id)"
      >
        {{ card.label }}
      </li>
    </ul>

    <div class="m-payments-new--title" *ngIf="cards.length">Or use a new card:</div>

    <minds-checkout-card-input (confirm)="setCard($event)" [hidden]="inProgress || confirmation" [useMDLStyling]="useMDLStyling" *ngIf="useCreditCard"></minds-checkout-card-input>
    <div [hidden]="!inProgress" class="m-checkout-loading">
      <div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active" style="margin:auto; display:block;" [mdl]></div>
      <p>Capturing card details...</p>
    </div>
  `
})

export class StripeCheckout {

  minds = window.Minds;
  loading: boolean = false;
  inProgress : boolean = false;
  confirmation : boolean = false;
  error : string = "";
  card;

  inputed : EventEmitter<any> = new EventEmitter;
  done : EventEmitter<any> = new EventEmitter;

  @Input() amount : number = 0;
  @Input() merchant_guid;
  @Input() gateway : string = "merchants";

  @Input('useMDLStyling') useMDLStyling: boolean = true;

  stripe;
  bt_checkout;
  nonce : string = "";

  cards: any[] = [];

  @Input() useCreditCard : boolean = true;
  @Input() useBitcoin : boolean = false;

	constructor(public client: Client, private cd: ChangeDetectorRef){
	}

  ngOnInit(){
    setTimeout(() => {
      this.setupStripe();
    }, 1000); //sometimes stripe can take a while to download

     this.loadSavedCards();
  }

  setupStripe(){
    if((<any>window).Stripe){
      (<any>window).Stripe.setPublishableKey(this.minds.stripe_key);
    }
  }

  loadSavedCards() {
    this.loading = true;
    this.cards = [];

    return this.client.get(`api/v1/payments/stripe/cards`)
      .then(({ cards }) => {
        this.loading = false;

        if (cards && cards.length) {
          this.cards = (<any[]>cards).map(card => ({
            id: card.id,
            label: `${card.brand} ${card.exp_month}/${('' + card.exp_year).substr(2)} **** ${card.last4}`
          }));
        }
      })
      .catch(e => {
        this.loading = false;
      });
  }

  setSavedCard(id) {
    this.inProgress = true;

    this.nonce = id;
    this.inputed.next(this.nonce);
    this.inProgress = false;
  }

  setCard(card){
    // console.log(card);
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
