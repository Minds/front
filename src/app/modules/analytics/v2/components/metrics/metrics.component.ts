import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsMetricsComponent implements OnInit, OnDestroy {
  @ViewChild('metricsWrapper', { static: true }) metricsWrapper: ElementRef;
  data;
  subscription: Subscription;
  user;
  userRoles: string[] = ['user'];

  metrics$;
  overflowing: boolean = false;
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
    this.checkOverflow();
  }

  updateMetric(metric) {
    this.analyticsService.updateMetric(metric.id);
  }

  checkOverflow() {
    // console.log(this.metricsWrapper);
    const metricsWrapper = this.metricsWrapper.nativeElement;
    this.overflowing =
      metricsWrapper.scrollWidth - metricsWrapper.clientWidth > 0;
    console.log(
      'overflowing?',
      this.overflowing,
      'scrollWidth:',
      metricsWrapper.scrollWidth,
      'clientWidth:',
      metricsWrapper.clientWidth
    );
  }

  // scrollIntoView() {
  //   element.scrollIntoView();
  // e.target.parentNode.scrollLeft = e.target.offsetLeft
  // }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
