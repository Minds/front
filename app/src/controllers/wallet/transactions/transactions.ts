import { Component } from '@angular/core';

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-wallet-transactions',
  templateUrl: 'transactions.html'
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
