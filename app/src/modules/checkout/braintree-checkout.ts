import { Component, EventEmitter, Input } from '@angular/core';

import { Client } from '../../services/api';
import { WalletService } from '../../services/wallet';
import { Storage } from '../../services/storage';

interface CreditCard {
  number?: number;
  type?: string;
  name?: string;
  sec?: number;
  month?: number | string;
  year?: number | string;
}

@Component({
  moduleId: module.id,
  selector: 'minds-payments-checkout',
  outputs: ['inputed', 'done'],
  template: `

    <div class="mdl-card m-payments-options" style="margin-bottom:8px;" *ngIf="usePayPal || useBitcoin">
        <div id="paypal-btn" *ngIf="usePayPal"></div>
        <div id="coinbase-btn" *ngIf="useBitcoin"></div>
    </div>

    <minds-checkout-card-input
      (confirm)="setCard($event)"
      [hidden]="inProgress || confirmation"
      *ngIf="useCreditCard">
    </minds-checkout-card-input>
    <div [hidden]="!inProgress" class="m-checkout-loading">
      <div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active" style="margin:auto; display:block;" [mdl]></div>
      <p i18n="@@CHECKOUT__CAPTURING_DETAILS">Capturing card details...</p>
    </div>

  `
})

export class Checkout {

  inProgress: boolean = false;
  confirmation: boolean = false;
  error: string = '';
  card;

  inputed: EventEmitter<any> = new EventEmitter;
  done: EventEmitter<any> = new EventEmitter;

  @Input() amount: number = 0;
  @Input() merchant_guid;
  @Input() gateway: string = 'merchants';

  braintree_client;
  bt_checkout;
  nonce: string = '';

  @Input('creditcard') useCreditCard: boolean = true;
  @Input('paypal') usePayPal: boolean = false;
  @Input('bitcoin') useBitcoin: boolean = false;

  constructor(public client: Client) {
    this.init();
  }

  init() {
    System.import('lib/braintree.js').then((braintree: any) => {
      this.client.get('api/v1/payments/braintree/token/' + this.gateway)
        .then((response: any) => { this.setupClient(braintree, response.token); });
    });
  }

  setupClient(braintree, token) {
    this.braintree_client = new braintree.api.Client({ clientToken: token });

    if (this.usePayPal && !window.BraintreeLoaded) {
      braintree.setup(token, 'custom', {
        onReady: (integration) => {
          this.bt_checkout = integration;
          window.BraintreeLoaded = true;
        },
        onPaymentMethodReceived: (payload) => {
          this.inputed.next(payload.nonce);
        },
        paypal: {
          singleUse: false,
          container: 'paypal-btn'
        },
        //coinbase: {
        //  container: "coinbase-btn",
        //  headless: true
        //}
      });
    }
  }

  setCard(card) {
    console.log(card);
    this.card = card;
    this.getCardNonce();
  }

  getCardNonce() {
    this.inProgress = true;
    this.braintree_client.tokenizeCard({
      number: this.card.number,
      expirationDate: this.card.month + '/' + this.card.year,
      //cardHolderName: this.card.name,
      //cardType: this.card.type,
      cvv: this.card.sec
    }, (err, nonce) => {
      if (err) {
        this.error = err;
        this.inProgress = false;
        return false;
      }
      console.log(err, nonce);
      this.nonce = nonce;
      this.inputed.next(nonce);
      this.inProgress = false;
      //    this.purchase();
    });
  }

  purchase() {
    var self = this;

    this.inProgress = true;
    this.error = '';
    this.client.post('api/v1/payments/braintree/charge', {
      nonce: this.nonce,
      amount: this.amount,
      merchant_guid: this.merchant_guid
    })
      .then((response: any) => {
        if (response.status !== 'success') {
          self.inProgress = false;
          self.error = 'Please check your card details and try again.';
          return false;
        }
        self.confirmation = true;
        self.inProgress = false;
      })
      .catch((e) => {
        self.inProgress = false;
        self.error = 'there was an error';
      });
  }

}
