import { Component, OnInit } from '@angular/core';
import fakeData from './../../fake-data';
import { Client } from '../../../../../services/api';

@Component({
  selector: 'm-analytics__layout--summary',
  templateUrl: './layout-summary.component.html',
})
export class AnalyticsLayoutSummaryComponent implements OnInit {
  loading = true;

  boosts: Array<any>;
  boostRows: Array<any> = [];
  fakeTiles;
  url = '/api/v2/analytics/dashboards/';
  tiles = [
    {
      id: 'pageviews',
      label: 'Daily pageviews',
      unit: 'number',
      interval: 'day',
      endpoint:
        this.url +
        'traffic?metric=pageviews&timespan=30d&filter=view_type::total,platform::all,channel::all',
    },
    {
      id: 'active_users',
      label: 'Daily Active Users',
      unit: 'number',
      interval: 'day',
      endpoint:
        this.url +
        'traffic?metric=active_users&timespan=30d&filter=channel::all',
    },
    {
      id: 'active_users',
      label: 'Monthly Active Users',
      unit: 'number',
      interval: 'month',
      endpoint:
        this.url +
        'traffic?metric=active_users&timespan=12m&filter=channel::all',
    },
    {
      id: 'signups',
      label: 'Signups',
      unit: 'number',
      interval: 'day',
      endpoint:
        this.url + 'traffic?metric=signups&timespan=30d&filter=channel::all',
    },
    {
      id: 'earnings',
      label: 'Total PRO Earnings',
      unit: 'usd',
      interval: 'day',
      endpoint:
        this.url +
        'earnings?metric=active_users&timespan=30d&filter=platform::all,view_type::total,channel::all',
    },
  ];

  constructor(private client: Client) {}

  ngOnInit() {
    // TODO: confirm how permissions/security will work
    this.fakeTiles = fakeData[3].tiles;
    this.boosts = fakeData[4].boosts.buckets;
    this.boostRows = [this.boosts.slice(0, 2), this.boosts.slice(2, 4)];

    this.getTiles();
    this.loading = false;
  }

  async getTiles() {
    this.tiles.forEach(tile => {
      this.client
        .get(tile.endpoint)
        .then((response: any) => {
          this.formatResponse(tile, response);
        })
        .catch(e => {
          console.error(e);
        });
    });
  }

  formatResponse(tile, response) {
    const metric = response.dashboard.metrics.find(m => m.id === tile.id);
    tile['metric'] = metric;
    tile['value'] = metric.visualisation.segments[0].buckets.slice(-1).value;
    tile['description'] = response.description;
  }
}
