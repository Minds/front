import { Component, ViewChild, ComponentFactoryResolver } from '@angular/core';

import { RevenueLedgerComponent } from '../../monetization/revenue/ledger.component';
import { Client } from '../../../services/api/client';

@Component({
  selector: 'm-walletUsd__balance',
  templateUrl: './balance.component.html',
})
export class WalletUSDBalanceComponent {
  balance: number;
  currency: string;
  interval: string;
  delay: number;
  anchor: number;

  constructor(private client: Client) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    const { account } = <any>(
      await this.client.get('api/v2/payments/stripe/connect')
    );
    this.balance =
      (account.totalBalance.amount + account.pendingBalance.amount) / 100;
    this.currency = account.totalBalance.currency;
    this.interval = account.payoutInterval;
    this.delay = account.payoutDelay;
    this.anchor = account.payoutAnchor;
  }
}
