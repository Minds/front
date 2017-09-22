import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../common/api/client.service';

@Component({
  selector: 'm-revenue--console',
  templateUrl: 'console.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RevenueConsoleComponent {

  currency: string = 'usd';
  balance: number | string = 0;
  payouts: number | string = 0;
  net: number | string = 0;
  ready: boolean = false;

  filter: string = 'payments';
  ledgerType: string = 'charge';

  constructor(private client: Client, private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.getTotals();
  }

  getTotals() {
    this.client.get('api/v1/monetization/revenue/overview')
      .then((response: any) => {
        this.currency = response.currency;
        this.balance = response.balance;
        this.payouts = response.payouts;
        this.net = response.total.net;
        this.ready = true;

        this.cd.markForCheck();
        this.cd.detectChanges();
      });
  }

  getCurrencySymbol(currency) {
    switch (currency) {
      case 'gbp':
        return '£';
      case 'eur':
        return '€';
      case 'usd':
      default:
        return '$';
    }
  }

}
