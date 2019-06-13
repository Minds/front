import { Component, OnInit } from '@angular/core';
import { Client } from "../../../../../services/api/client";

@Component({
  selector: 'm-analyticsactiveusers__card',
  templateUrl: 'active-users.component.html'
})

export class ActiveUsersCardComponent implements OnInit {
  hauUnique: number = 0;
  hauLoggedIn: number = 0;
  mauUnique: number = 0;
  mauLoggedIn: number = 0;
  dauUnique: number = 0;
  dauLoggedIn: number = 0;
  total: number = 0;

  constructor(private client: Client) { }

  ngOnInit() {
    this.getAvgData();
  }

  private async getAvgData() {
    try {
      let avgs: Array<any> = await Promise.all([
        this.client.get('api/v2/analytics/avgpageviews', { key: 'mau_unique' }),
        this.client.get('api/v2/analytics/avgpageviews', { key: 'mau_loggedin' }),
        this.client.get('api/v2/analytics/avgpageviews', { key: 'dau_loggedin' }),
        this.client.get('api/v2/analytics/avgpageviews', { key: 'dau_unique' }),
        this.client.get('api/v2/analytics/avgpageviews', { key: 'hau_unique' }),
        this.client.get('api/v2/analytics/avgpageviews', { key: 'hau_loggedin' }),
        this.client.get('api/v2/analytics/avgpageviews', { key: 'total_pageviews' })
      ]);
      this.mauUnique = avgs[0].data;

      this.mauLoggedIn = avgs[1].data;

      this.dauLoggedIn = avgs[2].data;

      this.dauUnique = avgs[3].data;

      this.hauUnique = avgs[4].data;

      this.hauLoggedIn = avgs[5].data;

      this.total = avgs[6].data;
    } catch (e) {
      console.error(e);
    }
  }
}
