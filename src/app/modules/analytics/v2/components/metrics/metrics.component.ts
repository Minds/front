import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AnalyticsDashboardService,
  Category,
  Response,
  Dashboard,
  Filter,
  Option,
  Metric as MetricBase,
  Summary,
  Visualisation,
  Bucket,
  Timespan,
  UserState,
} from '../../dashboard.service';
import isMobileOrTablet from '../../../../../helpers/is-mobile-or-tablet';

interface MetricExtended extends MetricBase {
  delta: number;
  hasChanged: boolean;
  positiveTrend: boolean;
}
export { MetricExtended as Metric };

@Component({
  selector: 'm-analytics__metrics',
  templateUrl: './metrics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsMetricsComponent implements OnInit, OnDestroy {
  data;
  subscription: Subscription;
  isMobile: boolean;

  metrics$;
  isOverflown = { left: false, right: false };

  constructor(private analyticsService: AnalyticsDashboardService) {}

  ngOnInit() {
    this.metrics$ = this.analyticsService.metrics$.pipe(
      map(_metrics => {
        const metrics = _metrics.map(metric => ({ ...metric })); // Clone to avoid updating

        for (let metric of metrics) {
          if (metric.summary) {
            const delta =
              (metric.summary.current_value - metric.summary.comparison_value) /
              metric.summary.comparison_value;

            metric['delta'] = delta;
            metric['hasChanged'] = delta === 0 ? false : true;

            if (
              (delta > 0 && metric.summary.comparison_positive_inclination) ||
              (delta < 0 && !metric.summary.comparison_positive_inclination)
            ) {
              metric['positiveTrend'] = true;
            } else {
              metric['positiveTrend'] = false;
            }
          }
        }

        return metrics;
      })
    );
    this.isMobile = isMobileOrTablet();
  }

  updateMetric(metric) {
    this.analyticsService.updateMetric(metric.id);
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  checkOverflow() {
    // element.scrollWidth - element.clientWidth
  }
}
