import { Component, ViewChild } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { AnalyticsCardComponent } from '../card/card.component';

@Component({
  selector: 'm-analyticspageviews__card',
  templateUrl: 'pageviews.component.html',
})
export class PageviewsCardComponent {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  currents: { name: string; value: number }[];
  avgPageviews: number = 0;

  constructor(private client: Client) {}

  ngOnInit() {
    this.getAvgData();

    this.card.selectedOptionChange.subscribe(() => {
      this.getAvgData();
    });
  }

  private async getAvgData() {
    try {
      const response: any = await this.client.get(
        'api/v2/analytics/pageviews',
        {
          key: 'avg',
          timespan: this.card.selectedOption,
        }
      );

      this.avgPageviews = response.data.pageviews;
    } catch (e) {
      console.error(e);
    }
  }
}
