import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnalyticsDashboardService } from '../../dashboard.service';

@Component({
  selector: 'm-analytics__chart',
  templateUrl: 'chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsChartComponent implements OnDestroy, OnInit {
  metricSubscription: Subscription;
  selectedMetric$ = this.analyticsService.metrics$.pipe(
    map(metrics => {
      return metrics.find(metric => metric.visualisation !== null);
    })
  );
  selectedMetric;

  timespansSubscription: Subscription;
  selectedTimespan;

  // ***********************************************************

  constructor(
    private analyticsService: AnalyticsDashboardService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.timespansSubscription = this.analyticsService.timespans$.subscribe(
      timespans => {
        this.selectedTimespan = timespans.find(
          timespan => timespan.selected === true
        );
        this.detectChanges();
      }
    );

    this.metricSubscription = this.selectedMetric$.subscribe(metric => {
      this.selectedMetric = metric;
      this.detectChanges();
    });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.metricSubscription.unsubscribe();
    this.timespansSubscription.unsubscribe();
  }
}
