import { Component, ViewChild } from '@angular/core';
import { Client } from "../../../../../services/api/client";
import { AnalyticsCardComponent } from "../card/card.component";
import { Subscription } from "rxjs";
import { timespanOption } from "../../charts/timespanOption";

@Component({
  selector: 'm-analyticsonchainboosts__card',
  templateUrl: 'boosts.component.html'
})

export class OnChainBoostsCardComponent {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  subscription: Subscription;

  timespan: timespanOption;
  average: number = 0;
  averageReclaimedTokens: number = 0;
  averageUsers: number = 0;

  constructor(private client: Client) {
  }

  ngOnInit() {
    this.getAvgData();

    this.subscription = this.card.selectedOptionChange.subscribe((value) => {
      this.timespan = value;
      this.getAvgData();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private async getAvgData() {
    try {
      let avgs: Array<any> = await Promise.all([
        this.client.get('api/v2/analytics/onchainboosts', { key: 'average', timespan: this.timespan }),
        this.client.get('api/v2/analytics/onchainboosts', { key: 'average_reclaimed_tokens', timespan: this.timespan }),
        this.client.get('api/v2/analytics/onchainboosts', { key: 'average_users', timespan: this.timespan }),
      ]);

      this.average = avgs[0].data;

      this.averageReclaimedTokens = avgs[1].data;

      this.averageUsers = avgs[2].data;
    } catch (e) {
      console.error(e);
    }
  }
}
