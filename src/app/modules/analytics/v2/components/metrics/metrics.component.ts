import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsMetricsComponent implements OnInit, AfterViewInit {
  @ViewChild('metricsContainer', { static: false })
  metricsContainerEl: ElementRef;
  metricsContainer;

  data;
  subscription: Subscription;
  user;
  userRoles: string[] = ['user'];
  init = false;

  metrics$;
  metricClientWidth: number;
  faderWidth = 24;
  isOverflown: boolean = false;
  isAtScrollEnd = false;
  isAtScrollStart = true;
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
    // TODO: if selected metric is not fully visible, slide() until it is
  }
  ngAfterViewInit() {
    this.checkOverflow();
  }

  updateMetric(metric) {
    // TODO: if clicked metric is not fully visible, slide() until it is
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
    const firstMetric = document.querySelector('.m-analytics__metric');
    this.metricClientWidth = firstMetric.clientWidth;

    this.metricsContainer = this.metricsContainerEl.nativeElement;
    this.isOverflown =
      this.metricsContainer.scrollWidth - this.metricsContainer.clientWidth > 0;

    this.isAtScrollStart = this.metricsContainer.scrollLeft < this.faderWidth;
    this.showButton.left = this.isOverflown && !this.isAtScrollStart;

    this.isAtScrollEnd =
      !this.isOverflown ||
      this.metricsContainer.scrollWidth -
        (this.metricsContainer.scrollLeft + this.metricsContainer.clientWidth) <
        this.faderWidth;

    this.showButton.right =
      this.isOverflown &&
      this.metricsContainer.scrollLeft >= 0 &&
      !this.isAtScrollEnd;
    this.detectChanges();
  }

  slide(direction) {
    let currentScrollLeft = this.metricsContainer.scrollLeft;
    let targetScrollLeft;
    let scrollEndOffset = 0;
    const partiallyVisibleMetricWidth =
      this.metricsContainer.clientWidth % this.metricClientWidth;
    const completelyVisibleMetricsWidth =
      this.metricsContainer.clientWidth - partiallyVisibleMetricWidth;

    if (direction === 'right') {
      if (currentScrollLeft < this.faderWidth) {
        currentScrollLeft = this.faderWidth;
      }
      targetScrollLeft = Math.min(
        currentScrollLeft + completelyVisibleMetricsWidth,
        this.metricsContainer.scrollWidth - completelyVisibleMetricsWidth
      );
    } else {
      if (this.isAtScrollEnd) {
        scrollEndOffset = partiallyVisibleMetricWidth - this.faderWidth;
      }
      targetScrollLeft = Math.max(
        currentScrollLeft - completelyVisibleMetricsWidth + scrollEndOffset,
        0
      );
    }

    this.metricsContainer.scrollTo({
      top: 0,
      left: targetScrollLeft,
      behavior: 'smooth',
    });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
