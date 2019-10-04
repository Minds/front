import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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

  //TODO: (maybe) interface ViewMetric implements Metric {}
  vm$: Observable<UserState> = this.analyticsService.vm$;
  vm: UserState;

  constructor(private analyticsService: AnalyticsDashboardService) {}

  ngOnInit() {
    this.subscription = this.vm$.subscribe(viewModel => (this.vm = viewModel));
    this.vm.metrics.forEach(metric => {
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
    });
  }

  updateMetric(metric) {
    this.analyticsService.updateMetric(metric);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
