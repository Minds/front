import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ChartColumn } from '../../../common/components/chart/chart.component';
import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'm-revenue--ledger',
  templateUrl: 'ledger.component.html',
  providers: [
    CurrencyPipe
  ]
})
export class RevenueLedgerComponent {

  @Input() type: string = 'charge';

  transactions: any[] = [];
  inProgress: boolean = false;

  offset: string = '';
  moreData: boolean = false;

  constructor(private client: Client, private currencyPipe: CurrencyPipe, private cd: ChangeDetectorRef, private route: ActivatedRoute) {
    route.url.subscribe(url => {
      this.type = url[0].path;
    });
  }

  ngOnInit() {
    this.loadList(true);
  }

  loadList(refresh = false): Promise<any> {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    if (refresh) {
      this.offset = '';
      this.moreData = true;
    }

    return this.client.get(`api/v1/monetization/service/analytics/list`, {
      offset: this.offset,
      limit: 12,
      type: this.type
    })
      .then(({ transactions, 'load-next': loadNext }) => {
        this.inProgress = false;

        if (transactions) {
          transactions.map((transaction) => {
            switch (transaction.category) {
              case 'points':
                transaction.category = 'Points (Affiliate)';
                break;
              case 'plus':
                transaction.category = 'Plus (Affiliate)';
                break;
            }
            return transaction;
          });
          this.transactions.push(...transactions);
        }

        if (loadNext) {
          this.offset = loadNext;
        } else {
          this.moreData = false;
        }

        this.cd.markForCheck();
        this.cd.detectChanges();
      })
      .catch(e => {
        this.inProgress = false;
        this.cd.markForCheck();
        this.cd.detectChanges();
        //this.error = e.message || 'Server error';
      });
  }

}
