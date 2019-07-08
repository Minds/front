import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from "../../../../../services/api/client";
import { AnalyticsCardComponent } from "../card/card.component";
import { Subscription } from "rxjs";

@Component({
  selector: 'm-analyticstokensales__card',
  templateUrl: 'sales.component.html'
})

export class TokenSalesCardComponent implements OnInit {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  subscription: Subscription;

  tokens: number = 0;
  sales: number = 0;
  buyers: number = 0;
  ethEarned: number = 0;
  ethUsdRate: number = 0;

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
        this.client.get('api/v2/analytics/tokensales', { key: 'average_sold' }),
        this.client.get('api/v2/analytics/tokensales', { key: 'average_sales' }),
        this.client.get('api/v2/analytics/tokensales', { key: 'average_buyers' }),
        this.client.get('api/v2/analytics/tokensales', { key: 'average_eth_earned' }),
        this.client.get('api/v2/analytics/tokensales', { key: 'average_eth_usd_rate' }),
      ]);
      this.tokens = avgs[0].data;

      this.sales = avgs[1].data;

      this.buyers = avgs[2].data;

      this.ethEarned = avgs[3].data;

      this.ethUsdRate = avgs[4].data;

    } catch (e) {
      console.error(e);
    }
  }
}
