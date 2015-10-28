import { Component, View, CORE_DIRECTIVES, FORM_DIRECTIVES, EventEmitter} from 'angular2/angular2';
import { RouterLink } from "angular2/router";
import { Client } from 'src/services/api';
import { WalletService } from 'src/services/wallet';
import { Storage } from 'src/services/storage';
import { MDL_DIRECTIVES } from 'src/directives/material';
import { InfiniteScroll } from 'src/directives/infinite-scroll';
import { CHECKOUT_COMPONENTS } from 'src/components/checkout';

interface CreditCard {
  number?: number,
  type?: string,
  name?: string,
  sec?: number,
  month?: number | string,
  year?: number | string
}

@Component({
  selector: 'minds-payments-checkout',
  providers: [ Client ],
  inputs: ['amount', 'merchant_guid'],
  outputs: ['inputed', 'done']
})
@View({
  template: `

    <div class="mdl-card mdl-shadow--2dp m-payments-options" style="margin-bottom:8px;">
      <div class="mdl-card__supporting-text">
        <div id="paypal-btn"></div>
      </div>
    </div>

    <minds-checkout-card-input (confirm)="setCard($event)" [hidden]="inProgress || confirmation"></minds-checkout-card-input>

    <p [hidden]="!inProgress">
      Please wait a moment...
    </p>
    <p [hidden]="!confirmation">
      Success.
    </p>
  `,
  directives: [ CORE_DIRECTIVES, MDL_DIRECTIVES, FORM_DIRECTIVES, CHECKOUT_COMPONENTS, InfiniteScroll ]
})

export class Checkout {

  inProgress : boolean = false;
  confirmation : boolean = false;
  error : string = "";
  card;

  inputed : EventEmitter = new EventEmitter;
  done : EventEmitter = new EventEmitter;

  amount : number = 0;
  merchant_guid;

  braintree_client;
  bt_checkout;
  nonce : string = "";

	constructor(public client: Client){
     this.init();
	}

  init(){
    System.import('lib/braintree.js').then((braintree : any) => {
        this.client.get('api/v1/payments/braintree/token')
         .then((response : any) => { this.setupClient(braintree, response.token); });
      });
  }

  setupClient(braintree, token){
    this.braintree_client = new braintree.api.Client({ clientToken: token });

    braintree.setup(token, "custom", {
      onReady: (integration) => {
        this.bt_checkout = integration;
      },
      onPaymentMethodReceived: (payload) => {
        this.inputed.next(payload.nonce);
        this.bt_checkout.teardown(() => {
          this.bt_checkout = null;
        });
      },
      paypal: {
        singleUse: true,
        container: 'paypal-btn'
      }
    });
  }

  setCard(card){
    console.log(card);
    this.card = card;
    this.getCardNonce();
  }

  getCardNonce(){

    this.braintree_client.tokenizeCard({
      number: this.card.number,
      expirationDate: this.card.month + '/' + this.card.year,
      //cardHolderName: this.card.name,
      //cardType: this.card.type,
      //cvv: this.card.sec
    }, (err, nonce) => {
      if(err){
        this.error = err;
      }
      console.log(err, nonce);
      this.nonce = nonce;
      this.inputed.next(nonce);
  //    this.purchase();
    });
  }

  purchase(){
    var self = this;

    this.inProgress = true;
    this.error = "";
    this.client.post('api/v1/payments/braintree/charge', {
        nonce: this.nonce,
        amount: this.amount,
        merchant_guid: this.merchant_guid
      })
      .then((response : any) => {
        if(response.status != 'success'){
          self.inProgress = false;
          self.error = "Please check your card details and try again.";
          return false;
        }
        self.confirmation = true;
        self.inProgress = false;
      })
      .catch((e) => {
        self.inProgress = false;
        self.error = "there was an error";
      });
  }

}
