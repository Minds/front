import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { AnalyticsCardComponent } from '../card/card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-analyticsonchainwire__card',
  templateUrl: 'wire.component.html',
})
export class OnchainWireCardComponent implements OnInit {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  subscription: Subscription;

  tokens: number = 0;
  transactions: number = 0;
  receivers: number = 0;
  senders: number = 0;
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
      const response: any = await this.client.get(
        'api/v2/analytics/onchainwire',
        {
          key: 'avg',
          timespan: this.card.selectedOption,
        }
      );

      this.tokens = response.data.tokens;
      this.transactions = response.data.transactions;
      this.receivers = response.data.receivers;
      this.senders = response.data.senders;
    } catch (e) {
      console.error(e);
    }
  }
}
