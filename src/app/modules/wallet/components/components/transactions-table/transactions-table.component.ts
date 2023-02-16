import { Component, Input } from '@angular/core';
import { DynamicBoostExperimentService } from '../../../../experiments/sub-services/dynamic-boost-experiment.service';

/**
 * Table that displays details about token/usd transactions, grouped by day
 *
 * Each row contains a timestamp, transaction type, amount,
 * and a colored visual indicator of whether the tx was a credit (green) or debit (red)
 *
 * See it at wallet > tokens > transactions
 */
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
    'offchain:Pro Payout': 'Earnings Payout',
    boost: 'On-Chain Boost',
    pro_earning: 'Pro Earnings',
    payout: 'Transfer to Bank Account',
  };

  constructor(
    protected dynamicBoostExperiment: DynamicBoostExperimentService
  ) {}

  getTypeLabel(type) {
    // type or superType - both are used
    if (this.currency !== 'tokens' && type === 'wire') {
      return 'Wire';
    } else {
      return this.typeLabels[type];
    }
  }
}
