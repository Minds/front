import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnalyticsDashboardService } from '../../dashboard.service';

@Component({
  selector: 'm-analytics__layout--chart',
  templateUrl: './layout-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsLayoutChartComponent implements OnInit {
  subscription: Subscription;
  selectedMetric$ = this.analyticsService.metrics$.pipe(
    map(metrics => {
      console.log(
        metrics,
        metrics.find(metric => metric.visualisation !== null)
      );
      return metrics.find(metric => metric.visualisation !== null);
    })
  );
  selectedMetric;
  constructor(private analyticsService: AnalyticsDashboardService) {}

  ngOnInit() {
    this.subscription = this.selectedMetric$.subscribe(metric => {
      this.selectedMetric = metric;
      try {
      } catch (err) {
        console.log(err);
      }
    });
  }
}
