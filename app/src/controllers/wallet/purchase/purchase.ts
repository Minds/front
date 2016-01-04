import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { Storage } from '../../../services/storage';
import { MDL_DIRECTIVES } from '../../../directives/material';
import { InfiniteScroll } from '../../../directives/infinite-scroll';

import { CreditCard } from '../../../interfaces/card-interface';


@Component({
  selector: 'minds-wallet-purchase',
  viewBindings: [ Client ]
})
@View({
  templateUrl: 'src/controllers/wallet/purchase/purchase.html',
  directives: [ CORE_DIRECTIVES, MDL_DIRECTIVES, FORM_DIRECTIVES, InfiniteScroll ]
})

export class WalletPurchase {

  card : CreditCard = <CreditCard>{ month: 'mm', year: 'yyyy'};

  points : number = 1000;
  usd : number;

  inProgress : boolean = false;
  confirmation : boolean = false;
  error : string = "";

	constructor(public client: Client, public wallet: WalletService){
    this.calculateUSD();
	}

  validate(){
    if(this.usd < 0.01)
      return false;

    if(!this.card.number || !this.card.sec || !this.card.name || !this.card.name2)
      return false;

    if(this.card.month == 'mm' || this.card.year == 'yyyy')
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

  purchase(){
    var self = this;
    if(!this.validate()){
      this.error = "Sorry, please check your details and try again";
      return false;
    }
    this.inProgress = true;
    this.error = "";
    var data : any = this.card;
    data.points = this.points;
    this.client.post('api/v1/wallet/charge', data)
      .then((response : any) => {
        if(response.status != 'success'){
          this.error = "Please check your card details and try again.";
          return false;
        }
        self.wallet.increment(data.points);
        self.confirmation = true;
        self.inProgress = false;
      });
  }

}
