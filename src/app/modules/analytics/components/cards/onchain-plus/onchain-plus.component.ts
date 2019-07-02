import { Component, ViewChild } from '@angular/core';
import { Client } from "../../../../../services/api/client";
import { AnalyticsCardComponent } from "../card/card.component";

@Component({
  selector: 'm-analyticsonchainplus__card',
  templateUrl: 'onchain-plus.component.html'
})

export class OnChainPlusCardComponent {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  reclaimedTokens: number = 0;
  users: number = 0;
  transactions: number = 0;

  constructor(private client: Client) {
  }

  ngOnInit() {
    this.getAvgData();
  }

  private async getAvgData() {
    try {
      let avgs: Array<any> = await Promise.all([
        this.client.get('api/v2/analytics/onchainplus', {
          key: 'average_reclaimed_tokens',
          timespan: this.card.selectedOption
        }),
        this.client.get('api/v2/analytics/onchainplus', {
          key: 'average_plus_users',
          timespan: this.card.selectedOption
        }),
        this.client.get('api/v2/analytics/onchainplus', {
          key: 'average_plus_tx',
          timespan: this.card.selectedOption
        }),
      ]);

      this.reclaimedTokens = avgs[0].data;
      this.users = avgs[1].data;
      this.transactions = avgs[2].data;
    } catch (e) {
      console.error(e);
    }
  }

}
