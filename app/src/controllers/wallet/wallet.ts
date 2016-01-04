import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Router, RouteParams, ROUTER_DIRECTIVES } from "angular2/router";

import { Client } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { SessionFactory } from '../../services/session';
import { MDL_DIRECTIVES } from '../../directives/material';
import { InfiniteScroll } from '../../directives/infinite-scroll';

import { WalletService } from '../../services/wallet';
import { WalletTransactions } from './transactions/transactions';
import { WalletPurchase } from './purchase/purchase';

import { Merchants } from './merchants/merchants';


@Component({
  selector: 'minds-wallet',
  viewBindings: [ Client, WalletService ],
  bindings: [ MindsTitle ]
})
@View({
  templateUrl: 'src/controllers/wallet/wallet.html',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, MDL_DIRECTIVES, InfiniteScroll,
    WalletTransactions, WalletPurchase, Merchants]
})

export class Wallet {

  session = SessionFactory.build();

  filter : string = "transactions";
  points : Number = 0;
  transactions : Array<any> = [];
  offset: string = "";
  inProgress : boolean = false;
  moreData : boolean = true;

	constructor(public client: Client, public wallet: WalletService, public router: Router, public params: RouteParams, public title: MindsTitle){
    if(!this.session.isLoggedIn()){
      router.navigate(['/Login']);
    }
    if(params.params['filter'])
      this.filter = params.params['filter'];

      this.title.setTitle("Wallet | Minds");
    this.wallet.getBalance(true);
	}

}
