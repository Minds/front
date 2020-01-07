import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AnalyticsDashboardService,
  Metric as MetricBase,
} from '../../dashboard.service';
import { Session } from '../../../../../services/session';

interface MetricExtended extends MetricBase {
  delta: number;
  hasChanged: boolean;
  positiveTrend: boolean;
  permissionGranted: boolean;
}
export { MetricExtended as Metric };

@Component({
  selector: 'm-analytics__metrics',
  templateUrl: './metrics.component.html',
})
export class AnalyticsMetricsComponent implements OnInit {
  subscription: Subscription;
  user;
  userRoles: string[] = ['user'];
  metrics$;

  constructor(
    private analyticsService: AnalyticsDashboardService,
    public session: Session
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    if (this.session.isAdmin()) {
      this.userRoles.push('admin');
    }
    if (this.user.pro) {
      this.userRoles.push('pro');
    }

    this.metrics$ = this.analyticsService.metrics$.pipe(
      map(_metrics => {
        const metrics = _metrics.map(metric => ({ ...metric })); // Clone to avoid updating
        for (const metric of metrics) {
          metric['permissionGranted'] = metric.permissions.some(role =>
            this.userRoles.includes(role)
          );
          if (metric.summary) {
            const cur: number = metric.summary.current_value || 0;
            const cmp: number = metric.summary.comparison_value || 0;

            let delta: number, hasChanged: boolean, positiveTrend: boolean;

            if (cur === cmp) {
              // Same values, no changes
              hasChanged = false;
              delta = 0;
            } else if (cmp === 0) {
              // Comparison value is 0, cannot calculate %
              hasChanged = true;
              delta = Infinity; // Will display infinity symbol
              positiveTrend = cur > 0;
            } else {
              // Normal cases
              hasChanged = true;
              delta = (cur - cmp) / cmp;
              positiveTrend = delta > 0;
            }

            if (!metric.summary.comparison_positive_inclination) {
              // If "comparison positive inclination" is not true, it
              // represents a "not-so-good" metric. So we'll flip the colors.
              // Upwards will be "bad"
              // Downwards will be "good"

              positiveTrend = !positiveTrend;
            }

            metric['delta'] = delta;
            metric['hasChanged'] = hasChanged;
            metric['positiveTrend'] = positiveTrend;
          }
        }
        return metrics;
      })
    );
  }

  updateMetric(metric) {
    // TODO: if clicked metric is not fully visible, slide() until it is
    this.analyticsService.updateMetric(metric.id);
  }
}
