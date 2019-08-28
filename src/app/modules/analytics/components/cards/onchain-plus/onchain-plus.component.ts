import { Component, ViewChild } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { AnalyticsCardComponent } from '../card/card.component';

@Component({
  selector: 'm-analyticsonchainplus__card',
  templateUrl: 'onchain-plus.component.html',
})
export class OnChainPlusCardComponent {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  reclaimedTokens: number = 0;
  users: number = 0;
  transactions: number = 0;
  currents: { name: string; value: number }[];

  constructor(private client: Client) {}

  ngOnInit() {
    this.getAvgData();
  }

  private async getAvgData() {
    try {
      const response: any = await this.client.get(
        'api/v2/analytics/onchainplus',
        {
          key: 'avg',
          timespan: this.card.selectedOption,
        }
      );

      this.reclaimedTokens = response.data.tokens;
      this.users = response.data.users;
      this.transactions = response.data.transactions;
    } catch (e) {
      console.error(e);
    }
  }
}
