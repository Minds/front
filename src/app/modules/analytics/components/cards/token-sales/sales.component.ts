import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { AnalyticsCardComponent } from '../card/card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-analyticstokensales__card',
  templateUrl: 'sales.component.html',
})
export class TokenSalesCardComponent implements OnInit {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  subscription: Subscription;

  tokens: number = 0;
  sales: number = 0;
  buyers: number = 0;
  ethValue: number = 0;
  ethUsdRate: number = 0;
  currentSales: { name: string; value: number }[];
  currentRates: { name: string; value: number }[];

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
      let avgs: Array<any> = await Promise.all([
        this.client.get('api/v2/analytics/tokensales', {
          key: '_avg',
          timespan: this.card.selectedOption,
        }),
        this.client.get('api/v2/analytics/tokensales', {
          key: 'monthly_rate_avg',
          timespan: this.card.selectedOption,
        }),
      ]);
      this.tokens = avgs[0].data.tokens;

      this.sales = avgs[0].data.transactions;

      this.buyers = avgs[0].data.buyers;

      this.ethValue = avgs[1].data.ethValue;

      this.ethUsdRate = avgs[1].data.ethUsdRate;
    } catch (e) {
      console.error(e);
    }
  }
}
