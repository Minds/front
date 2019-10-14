import { Component, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';

import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';
import { RevenueLedgerComponent } from '../../monetization/revenue/ledger.component';
import { Session } from '../../../services/session';
import { Client } from '../../../services/api/client';

@Component({
  selector: 'm-walletUsd__transactions',
  templateUrl: './transactions.component.html',
})
export class WalletUSDTransactionsComponent {
  transactions = [];

  constructor(
    private router: Router,
    private session: Session,
    private client: Client
  ) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    const { transactions } = <any>(
      await this.client.get('api/v2/payments/stripe/transactions')
    );
    this.transactions = transactions;
  }
}
