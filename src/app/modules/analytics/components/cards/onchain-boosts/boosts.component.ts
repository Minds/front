import { Component, ViewChild } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { AnalyticsCardComponent } from '../card/card.component';
import { Subscription } from 'rxjs';
import { timespanOption } from '../../charts/timespanOption';

@Component({
  selector: 'm-analyticsonchainboosts__card',
  templateUrl: 'boosts.component.html',
})
export class OnChainBoostsCardComponent {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  subscription: Subscription;

  timespan: timespanOption;
  average: number = 0;
  averageReclaimedTokens: number = 0;
  averageUsers: number = 0;
  currents: { name: string; value: number }[];

  constructor(private client: Client) {}

  ngOnInit() {
    this.getAvgData();

    this.subscription = this.card.selectedOptionChange.subscribe(value => {
      this.timespan = value;
      this.getAvgData();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private async getAvgData() {
    try {
      const response: any = await this.client.get(
        'api/v2/analytics/onchainboosts',
        {
          key: 'avg',
          timespan: this.timespan,
        }
      );

      this.average = response.data.transactions;

      this.averageReclaimedTokens = response.data.reclaimedTokens;

      this.averageUsers = response.data.users;
    } catch (e) {
      console.error(e);
    }
  }
}
