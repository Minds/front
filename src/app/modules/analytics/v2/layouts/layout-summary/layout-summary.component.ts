import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import fakeData from './../../fake-data';
import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';

@Component({
  selector: 'm-analytics__layout--summary',
  templateUrl: './layout-summary.component.html',
})
export class AnalyticsLayoutSummaryComponent implements OnInit {
  loading = true;

  boosts: Array<any>;
  boostRows: Array<any> = [];
  fakeTiles;
  url = 'api/v2/analytics/dashboards/';
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
      endpoint: this.url + 'traffic',
      params: {
        metric: 'active_users',
        timespan: '30d',
        filter: 'channel::all',
      },
    },
    {
      id: 'active_users',
      label: 'Monthly Active Users',
      unit: 'number',
      interval: 'month',
      endpoint: this.url + 'traffic',
      params: {
        metric: 'active_users',
        timespan: '1y',
        filter: 'channel::all',
      },
    },
    {
      id: 'signups',
      label: 'Signups',
      unit: 'number',
      interval: 'day',
      endpoint: this.url + 'traffic',
      params: {
        metric: 'signups',
        timespan: '30d',
        filter: 'channel::all',
      },
    },
    {
      id: 'earnings_total',
      label: 'Total Pro Earnings',
      unit: 'usd',
      interval: 'day',
      endpoint: this.url + 'earnings',
      params: {
        metric: 'earnings_total',
        timespan: '30d',
        filter: 'platform::all,view_type::total,channel::all',
      },
    },
  ];

  constructor(
    private client: Client,
    public session: Session,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // TODO: confirm how permissions/security will work
    this.fakeTiles = fakeData[3].tiles;

    // TODO: enable boost backlog stuff when endpoint is ready.
    // Ideally the response will be formatted as an array of 4 objs,
    // each with id, label, and value (in hours)
    // this.boosts = fakeData[4].boosts.buckets;
    // this.boostRows = [this.boosts.slice(0, 2), this.boosts.slice(2, 4)];

    this.getTiles();
  }

  async getTiles() {
    this.tiles.forEach(async tile => {
      try {
        const response: any = await this.client.get(tile.endpoint, tile.params);
        await this.formatResponse(tile, response);
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
      this.detectChanges();
    });
  }

  async formatResponse(tile, response) {
    const metric = response.dashboard.metrics.find(m => m.id === tile.id);
    if (!metric) return;
    tile.metric = metric;
    const buckets = metric.visualisation
      ? metric.visualisation.segments[0].buckets
      : [];
    tile.value = buckets[buckets.length - 1]
      ? buckets[buckets.length - 1].value
      : 0;
    tile.description = metric.description;
    tile.visualisation = metric.visualisation;
    this.cd.markForCheck();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
