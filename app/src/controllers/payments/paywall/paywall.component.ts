import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { Storage } from '../../../services/storage';
import { SessionFactory } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-paywall',
  templateUrl: 'paywall.component.html'
})

export class PayWall {

  minds = (<any>window).Minds;

  inProgress : boolean = false;
  showCheckout : boolean = false;
  amount : number;
  nonce : string = "";
  showSignupModal: boolean = false;
  session = SessionFactory.build();

  @Output('entityChange') update : EventEmitter<any> = new EventEmitter;

  @Input() entity;

	constructor(public client: Client){
	}

  ngOnInit(){
    //get the subscription amount
  }

  checkout() {
    if (!this.session.isLoggedIn()) {
      this.showSignupModal = true;
      return;
    }

    this.inProgress = true;

    this.client.get('api/v1/payments/plans/exclusive/' + this.entity.guid)
      .then((response: any) => {
        this.inProgress = false;
        if(response.subscribed){
          this.update.next(response.entity);
          return;
        }
        this.showCheckout = true;
        this.amount = response.amount;
      });
  }

  subscribe(nonce){
    this.showCheckout = false;
    console.log('nonce: ' + nonce);
    this.client.post('api/v1/payments/plans/subscribe/' + this.entity.owner_guid + '/exclusive', {
        nonce: nonce
      })
      .then((response) => setTimeout(() => this.checkout(), 0));
  }

  ngOnDestroy(){
  }

}
