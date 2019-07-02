import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from "../../../../../services/api/client";
import { AnalyticsCardComponent } from "../card/card.component";
import { Subscription } from "rxjs";

@Component({
  selector: 'm-analyticsonchainwire__card',
  templateUrl: 'wire.component.html'
})

export class OnchainWireCardComponent implements OnInit {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  subscription: Subscription;

  tokens: number = 0;
  transactions: number = 0;
  receivers: number = 0;
  senders: number = 0;

  constructor(private client: Client) {
  }

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
      let avgs: Array<any> = await Promise.all([
        this.client.get('api/v2/analytics/onchainwire', {
          key: 'average_tokens',
          timespan: this.card.selectedOption
        }),
        this.client.get('api/v2/analytics/onchainwire', {
          key: 'average',
          timespan: this.card.selectedOption
        }),
        this.client.get('api/v2/analytics/onchainwire', {
          key: 'average_receivers',
          timespan: this.card.selectedOption
        }),
        this.client.get('api/v2/analytics/onchainwire', {
          key: 'average_senders',
          timespan: this.card.selectedOption
        }),
      ]);

      this.tokens = avgs[0].data;
      this.transactions = avgs[1].data;
      this.receivers = avgs[2].data;
      this.senders = avgs[3].data;
    } catch (e) {
      console.error(e);
    }
  }
}
