import { Component } from '@angular/core';

import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { Storage } from '../../../services/storage';
import { CreditCard } from '../../../interfaces/card-interface';


@Component({
  moduleId: module.id,
  selector: 'minds-wallet-purchase',
  templateUrl: 'purchase.html',
  inputs: [ 'toggled' ]
})

export class WalletPurchase {

  card : CreditCard = <CreditCard>{ month: 'mm', year: 'yyyy'};

  ex : number = 0.01;
  points : number = 10000;
  usd : number;

  subscription;

  inProgress : boolean = false;
  confirmation : boolean = false;
  nonce : string | number = "";
  recurring : boolean = true;
  error : string = "";

  toggled : boolean = false;

	constructor(public client: Client, public wallet: WalletService){
    this.getRate();
    this.calculateUSD();
    this.getSubscription();
	}

  validate(){
    if(this.usd < 0.01)
      return false;

    return true;
  }

  getRate(){
    this.client.get('api/v1/wallet/count')
      .then((response : any) => {
        this.ex = response.ex.usd;
      });
  }

  calculatePoints(){
    this.points = this.usd / this.ex;
  }

  calculateUSD(){
    this.usd = this.points * this.ex;
    this.client.post('api/v1/wallet/quote', { points: this.points })
      .then((response : any) => {
        this.usd = response.usd;
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
          this.wallet.increment(this.points*1.1);
          this.confirmation = true;
          this.inProgress = false;
        })
        .catch((e) => {
          this.error = e.message;
          this.inProgress = false;
          this.nonce = null;
        });
    } else {
        this.client.post('api/v1/wallet/purchase-once', {
          amount: this.usd,
          points: this.points,
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
          this.error = e.message;
          this.inProgress = false;
          this.nonce = null;
        });
    }
  }

  cancelSubscription(){
    if(!confirm("Are you sure you wish to cancel your monthly points subscription?"))
      return false;
    this.client.delete('api/v1/wallet/subscription')
      .then((response : any) => {
        this.subscription = null;
      });
  }

  setNonce(nonce : string){
    this.nonce = nonce;
    this.purchase();
  }

  reset(){
    this.getSubscription();
    this.confirmation = false;
    this.nonce = null;
  }

}
