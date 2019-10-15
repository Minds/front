import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { Session } from '../../../../../services/session';
import isMobileOrTablet from '../../../../../helpers/is-mobile-or-tablet';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsMetricsComponent implements OnInit, OnDestroy {
  data;
  subscription: Subscription;
  isMobile: boolean;
  user;
  userRoles: string[] = ['user'];

  metrics$;
  isOverflown = { left: false, right: false };

  constructor(
    private analyticsService: AnalyticsDashboardService,
    public session: Session,
    private cd: ChangeDetectorRef
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
            let delta;
            if (metric.summary.comparison_value !== 0) {
              delta =
                (metric.summary.current_value -
                  metric.summary.comparison_value) /
                (metric.summary.comparison_value || 0);
            } else {
              delta = 1;
            }

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

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  checkOverflow() {
    // element.scrollWidth - element.clientWidth
  }
}
