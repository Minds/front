import { Component, View, CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';
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
  name2?: string,
  sec?: number,
  month?: number | string,
  year?: number | string
}

@Component({
  selector: 'minds-payments-checkout',
  providers: [ Client ],
  inputs: ['amount', 'merchant_guid']
})
@View({
  template: `
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

  amount : number = 0;
  merchant_guid;

  braintree_client;
  nonce : string = "";

	constructor(public client: Client){
     this.init();
	}

  init(){

    System.import('lib/braintree.js')
     .then((braintree : any) => {
       var self = this;
        this.client.get('api/v1/payments/braintree/token')
         .then((response : any) => {
            self.braintree_client = new braintree.api.Client({ clientToken: response.token });
        });
     });
  }

  setCard(card){
    console.log(card);
    this.card = card;
    this.getCardNonce();
  }

  getCardNonce(){
    console.log(this.braintree_client);
    this.braintree_client.tokenizeCard({
      number: this.card.number,
      expirationDate: this.card.month + '/' + this.card.year
    }, (err, nonce) => {
      if(err){
        this.error = err;
      }
      this.nonce = nonce;
      this.purchase();
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
