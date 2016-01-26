import { Component } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { Storage } from '../../../services/storage';
import { MDL_DIRECTIVES } from '../../../directives/material';
import { InfiniteScroll } from '../../../directives/infinite-scroll';

import { Checkout } from '../../payments/checkout';

import { CreditCard } from '../../../interfaces/card-interface';


@Component({
  selector: 'minds-wallet-purchase',
  templateUrl: 'src/controllers/wallet/purchase/purchase.html',
  inputs: [ 'toggled' ],
  directives: [ CORE_DIRECTIVES, MDL_DIRECTIVES, FORM_DIRECTIVES, InfiniteScroll, Checkout ]
})

export class WalletPurchase {

  card : CreditCard = <CreditCard>{ month: 'mm', year: 'yyyy'};

  points : number = 1000;
  usd : number;

  subscription;

  inProgress : boolean = false;
  confirmation : boolean = false;
  nonce : string | number = "";
  recurring : boolean = true;
  error : string = "";

  toggled : boolean = false;

	constructor(public client: Client, public wallet: WalletService){
    this.calculateUSD();
    this.getSubscription();
	}

  validate(){
    if(this.usd < 0.01)
      return false;

    return true;
  }

  calculatePoints(){}

  calculateUSD(){
    var self = this;
    this.client.post('api/v1/wallet/quote', { points: this.points })
      .then((response : any) => {
        self.usd = response.usd;
      });
  }

  getSubscription(){
    this.client.get('api/v1/wallet/subscription')
      .then((response : any) => {
        if(response.subscription){
          this.subscription = response.subscription;
        }
      });
  }

  buy(){
    if(!this.toggled){
      this.toggled = true;
    }
  }

  purchase(){
    if(!this.validate()){
      this.error = "Sorry, please check your details and try again";
      return false;
    }
    this.inProgress = true;
    this.error = "";

    if(this.recurring){
      this.client.post('api/v1/wallet/subscription', {
          points: this.points,
          nonce: this.nonce
        })
        .then((response : any) => {
          if(response.status != 'success'){
            this.error = "Please check your payment details and try again.";
            this.inProgress = false;
            this.nonce = null;
            return false;
          }
          this.wallet.increment(this.points);
          this.confirmation = true;
          this.inProgress = false;
        })
        .catch((e) => {
          this.error = "Sorry, there was a problem";
          this.inProgress = false;
          this.nonce = null;
        });
    } else {
        this.client.post('api/v1/payments/braintree/charge', {
          amount: this.usd,
          nonce: this.nonce
        })
        .then((response : any) => {
          if(response.status != 'success'){
            this.error = "Please check your payment details and try again.";
            return false;
          }
          this.wallet.increment(this.points);
          this.confirmation = true;
          this.inProgress = false;
        })
        .catch((e) => {
          this.error = "Sorry, there was a problem";
          this.inProgress = false;
          this.nonce = null;
        });
    }
  }

  setNonce(nonce : string){
    this.nonce = nonce;
    this.purchase();
  }

}
