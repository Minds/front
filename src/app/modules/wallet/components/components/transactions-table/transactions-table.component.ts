import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-walletTransactionsTable',
  templateUrl: './transactions-table.component.html',
})
export class WalletTransactionsTableComponent {
  @Input() currency: string;
  @Input() transactions: any;
  @Input() filterApplied: boolean = false;

  typeLabels = {
    'offchain:wire': 'Off-Chain Wire',
    wire: 'On-Chain Wire',
    reward: 'Reward',
    token: 'Purchase',
    withdraw: 'On-Chain Transfer',
    'offchain:boost': 'Off-Chain Boost',
    boost: 'On-Chain Boost',
    pro_earning: 'Pro Earnings',
    payout: 'Transfer to Bank Account',
  };

  constructor() {}

  getTypeLabel(type) {
    // type or superType - both are used
    if (this.currency !== 'tokens' && type === 'wire') {
      return 'Wire';
    } else {
      return this.typeLabels[type];
    }
  }
}
