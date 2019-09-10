import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { AnalyticsCardComponent } from '../card/card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-analyticswithdraw__card',
  templateUrl: 'withdraw.component.html',
})
export class WithdrawCardComponent implements OnInit {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  subscription: Subscription;

  tokens: number = 0;
  transactions: number = 0;
  users: number = 0;
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
      const response: any = await this.client.get('api/v2/analytics/withdraw', {
        key: 'avg',
        timespan: this.card.selectedOption,
      });

      this.tokens = response.data.tokens;

      this.transactions = response.data.transactions;

      this.users = response.data.users;
    } catch (e) {
      console.error(e);
    }
  }
}
