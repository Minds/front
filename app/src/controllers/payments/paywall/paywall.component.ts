import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { RouterLink } from "@angular/router-deprecated";

import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { Storage } from '../../../services/storage';
import { MDL_DIRECTIVES } from '../../../directives/material';
import { InfiniteScroll } from '../../../directives/infinite-scroll';
import { StripeCheckout } from '../stripe-checkout';

@Component({
  selector: 'minds-paywall',
  templateUrl: 'src/controllers/payments/paywall/paywall.component.html',
  directives: [ CORE_DIRECTIVES, MDL_DIRECTIVES, FORM_DIRECTIVES, StripeCheckout, InfiniteScroll ]
})

export class PayWall {

  inProgress : boolean = false;
  showCheckout : boolean = false;
  nonce : string = "";

  @Output() update : EventEmitter<any> = new EventEmitter;

  @Input() entity;

	constructor(public client: Client){
	}

  ngOnInit(){
    //get the subscription amount
  }

  subscribe(nonce){
    this.showCheckout = false;
    console.log('nonce: ' + nonce);
    this.client.post('api/v1/payments/paywall/subscribe', {
        nonce: nonce
      })
      .then((response) => {

      });
  }

  ngOnDestroy(){
  }

}
