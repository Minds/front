import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { AnalyticsCardComponent } from '../card/card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-analyticsactiveusers__card',
  templateUrl: 'active-users.component.html',
})
export class ActiveUsersCardComponent implements OnInit {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  subscription: Subscription;

  hauUnique: number = 0;
  hauLoggedIn: number = 0;
  mauUnique: number = 0;
  mauLoggedIn: number = 0;
  dauUnique: number = 0;
  dauLoggedIn: number = 0;
  total: number = 0;
  currents: { name: string; value: number }[];

  constructor(private client: Client) {}

  ngOnInit() {
    this.getAvgData();

    this.subscription = this.card.selectedOptionChange.subscribe(() => {
      this.getAvgData();
    });
  }

  private async getAvgData() {
    try {
      let avgs: Array<any> = await Promise.all([
        this.client.get('api/v2/analytics/activeusers', {
          key: 'avg',
          timespan: 'hourly',
        }),
        this.client.get('api/v2/analytics/activeusers', {
          key: 'avg',
          timespan: 'daily',
        }),
        this.client.get('api/v2/analytics/activeusers', {
          key: 'avg',
          timespan: 'monthly',
        }),
        this.client.get('api/v2/analytics/avgpageviews', {
          key: 'total_pageviews',
        }),
      ]);

      this.hauUnique = avgs[0].data.uniqueHAU;
      this.hauLoggedIn = avgs[0].data.loggedInHAU;

      this.dauUnique = avgs[1].data.uniqueDAU;
      this.dauLoggedIn = avgs[1].data.loggedInDAU;

      this.mauUnique = avgs[2].data.uniqueMAU;
      this.mauLoggedIn = avgs[2].data.loggedInMAU;

      this.total = avgs[3].data;
    } catch (e) {
      console.error(e);
    }
  }
}
