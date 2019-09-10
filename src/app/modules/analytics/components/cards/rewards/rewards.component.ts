import { Component, ViewChild } from '@angular/core';
import { AnalyticsCardComponent } from '../card/card.component';
import { Client } from '../../../../../services/api/client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-analyticsrewards__card',
  templateUrl: 'rewards.component.html',
})
export class RewardsCardComponent {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  subscription: Subscription;

  avgTransactions: number = 0;
  avgRewardedTokens: number = 0;

  currents: { name: string; value: number }[];

  constructor(private client: Client) {}

  ngOnInit() {
    this.getAvgData();

    this.subscription = this.card.selectedOptionChange.subscribe(() => {
      this.getAvgData();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private async getAvgData() {
    try {
      const response: any = await this.client.get('api/v2/analytics/rewards', {
        key: 'avg',
        timespan: this.card.selectedOption,
      });

      this.avgTransactions = response.data.tokens;
      this.avgRewardedTokens = response.data.transactions;
    } catch (e) {
      console.error(e);
    }
  }
}
