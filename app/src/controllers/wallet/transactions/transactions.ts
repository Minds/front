import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { MDL_DIRECTIVES } from '../../../directives/material';
import { InfiniteScroll } from '../../../directives/infinite-scroll';


@Component({
  selector: 'minds-wallet-transactions',
  viewBindings: [ Client ]
})
@View({
  templateUrl: 'src/controllers/wallet/transactions/transactions.html',
  directives: [ CORE_DIRECTIVES, MDL_DIRECTIVES, InfiniteScroll ]
})

export class WalletTransactions {

  session = SessionFactory.build();

  transactions : Array<any> = [];
  offset: string = "";
  inProgress : boolean = false;
  moreData : boolean = true;

	constructor(public client: Client){
    this.load();
	}

  load(refresh : boolean = false){
    var self = this;
    this.inProgress = true;
    this.client.get('api/v1/wallet/transactions', { limit: 12, offset: this.offset})
      .then((response : any) => {

        if(!response.transactions){
          self.moreData = false;
          self.inProgress = false;
          return false;
        }

        if(refresh){
          self.transactions = response.transactions
        } else {
          if(self.offset)
            response.transactions.shift();
          for(let transaction of response.transactions)
            self.transactions.push(transaction);
        }

        self.offset = response['load-next'];
        self.inProgress = false;
      })
      .catch((e)=>{

      });
  }

}
