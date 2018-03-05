import { Component, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-wallet--points',
  templateUrl: 'points.component.html'
})

export class WalletPointsComponent {

  transactions: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;

  constructor(
    public client: Client,
    private cd: ChangeDetectorRef,
    public session: Session
  ) {
    this.load();
  }

  load(refresh: boolean = false) {
    this.inProgress = true;
    this.client.get('api/v1/wallet/transactions', { limit: 12, offset: this.offset })
      .then((response: any) => {

        if (!response.transactions) {
          this.moreData = false;
          this.inProgress = false;
          return false;
        }

        if (refresh) {
          this.transactions = response.transactions;
        } else {
          if (this.offset)
            response.transactions.shift();
          for (let transaction of response.transactions)
            this.transactions.push(transaction);
        }

        this.offset = response['load-next'];
        this.inProgress = false;
        this.cd.markForCheck();
        this.cd.detectChanges();
      });
  }

}
