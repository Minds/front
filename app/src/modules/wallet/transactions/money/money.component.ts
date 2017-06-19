import { Component } from '@angular/core';

import { Client } from '../../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-wallet-transactions-money',
  templateUrl: 'money.component.html'
})

export class WalletTransactionsMoney {

  ledger: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';

  constructor(private client: Client) {
  }

  ngOnInit() {
    this.load(true);
  }

  load(refresh: boolean = false) {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    if (refresh) {
      this.ledger = [];
      this.moreData = true;
      this.offset = '';
    }

    this.client.get('api/v1/monetization/ledger/list', { offset: this.offset })
      .then((response: any) => {
        this.inProgress = false;

        if (response.ledger) {
          this.ledger.push(...response.ledger);
        } else {
          this.moreData = false;
        }

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }
      })
      .catch(e => {
        this.inProgress = false;
        this.moreData = false;
        console.error(e);
      });
  }
}
