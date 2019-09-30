import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AnalyticsDashboardService,
  Category,
  Response,
  Dashboard,
  Filter,
  Option,
  Metric,
  Summary,
  Visualisation,
  Bucket,
  Timespan,
  UserState,
} from '../../dashboard.service';

@Component({
  selector: 'm-analytics__metrics',
  templateUrl: './metrics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsMetricsComponent implements OnInit {
  data;
  metrics: Array<any>;
  activeMetric: string = '';
  vm$: Observable<UserState> = this.analyticsService.vm$;
  constructor(private analyticsService: AnalyticsDashboardService) {}

  ngOnInit() {
    this.data = this.analyticsService.getData();

    this.metrics = this.data.metrics;
    this.activeMetric = this.data.metric;

    this.metrics.forEach(metric => {
      const delta =
        (metric.summary.current_value - metric.summary.comparison_value) /
        metric.summary.comparison_value;

      metric.delta = delta;
      if (
        (delta > 0 && metric.comparison_positive_inclination) ||
        (delta < 0 && !metric.comparison_positive_inclination)
      ) {
        metric.positive = true;
      } else {
        metric.positive = false;
      }
    });
  }

  updateMetric(metric) {
    this.activeMetric = metric;
    console.log('updated metric: ' + metric.id);
  }
}
