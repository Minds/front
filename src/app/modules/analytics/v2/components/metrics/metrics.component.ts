import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
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
export class AnalyticsMetricsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('metricsContainer', { static: false })
  metricsContainer: ElementRef;

  data;
  subscription: Subscription;
  user;
  userRoles: string[] = ['user'];
  init = false;

  metrics$;
  metricsLength: number;
  firstVisibleMetricIndex = 0;
  metricsContainerScrollLeft = 0;
  isOverflown: boolean = false;
  showButton = { left: false, right: false };

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
        this.metricsLength = metrics.length;
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
  }
  ngAfterViewInit() {
    this.init = true;
    this.checkOverflow();
  }

  updateMetric(metric) {
    this.analyticsService.updateMetric(metric.id);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkOverflow();
  }

  onScroll($event) {
    this.checkOverflow();
  }

  checkOverflow() {
    const metricsContainer = this.metricsContainer.nativeElement;
    const firstMetric = document.querySelector('.m-analytics__metric');
    const metricClientWidth = firstMetric.clientWidth;

    this.isOverflown =
      metricsContainer.scrollWidth - metricsContainer.clientWidth > 0;

    this.showButton.left = this.isOverflown && metricsContainer.scrollLeft > 24;

    this.showButton.right =
      this.isOverflown &&
      (metricsContainer.scrollLeft >= 0 ||
        metricsContainer.scrollWidth - metricsContainer.scrollLeft <
          metricsContainer.clientWidth);
    this.detectChanges();
  }

  slideLeft() {
    this.metricsContainer.nativeElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  slideRight() {
    this.metricsContainer.nativeElement.scrollTo({
      top: 0,
      left: 300,
      behavior: 'smooth',
    });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
