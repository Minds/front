import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
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
      return metrics.find(metric => metric.visualisation !== null);
    })
  );
  selectedMetric;
  isTable: boolean = false;

  constructor(
    private analyticsService: AnalyticsDashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.selectedMetric$.subscribe(metric => {
      this.selectedMetric = metric;

      this.isTable = this.selectedMetric.visualisation.type === 'table';
      this.detectChanges();
    });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
