import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { AnalyticsDashboardService } from '../../dashboard.service';
import fakeData from './../../fake-data';
import { Client } from '../../../../../services/api';

@Component({
  selector: 'm-analytics__layout--summary',
  templateUrl: './layout-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsLayoutSummaryComponent implements OnInit {
  loading = true;

  boosts;

  // activeUsersTile = {
  //   id: 'active_users',
  //   label: 'Active users on site',
  //   description: 'Coming soon! Realtime count of all users on web and mobile',
  //   benchmark: {
  //     value: '...',
  //   },
  // };

  tiles = [
    // {
    //   id: 'pageviews',
    //   label: 'Daily pageviews',
    //   endpoint:
    //     'api/v2/analytics/dashboards/traffic?metric=pageviews&timespan=30d&filter=view_type::total,channel::all',
    // },
  ];

  constructor(
    private analyticsService: AnalyticsDashboardService,
    private cd: ChangeDetectorRef,
    private client: Client
  ) {}

  ngOnInit() {
    // TODO: confirm how permissions/security will work
    this.tiles = fakeData[3].tiles;
    this.boosts = fakeData[4].boosts;

    this.loading = false;
    // this.getPageviews();
    this.detectChanges();
  }

  async getPageviews() {
    this.tiles.forEach(endpoint => {
      this.client
        .get(endpoint.endpoint)
        .then((response: any) => {
          const metric = response.dashboard.metrics.find(
            m => m.id === endpoint.id
          );
          endpoint['metric'] = metric;

          endpoint['benchmark'] =
            metric.visualisation.segments[0].buckets[
              metric.visualisation.segments[0].buckets.length - 1
            ];
        })
        .catch(e => {
          console.error(e);
        });
    });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
