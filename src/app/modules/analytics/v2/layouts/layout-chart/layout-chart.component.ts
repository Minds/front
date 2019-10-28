import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnalyticsDashboardService } from '../../dashboard.service';
import isMobileOrTablet from '../../../../../helpers/is-mobile-or-tablet';

@Component({
  selector: 'm-analytics__layout--chart',
  templateUrl: './layout-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsLayoutChartComponent implements OnInit {
  subscription: Subscription;
  loading$ = this.analyticsService.loading$;
  selectedMetric$ = combineLatest(
    this.analyticsService.metrics$,
    this.analyticsService.metric$,
    this.analyticsService.category$
  ).pipe(
    map(([metrics, id, category]) => {
      return metrics.find(metric => metric.id == id);
    })
  );
  selectedMetric;
  isTable: boolean = false;
  isMobile: boolean;

  constructor(
    private analyticsService: AnalyticsDashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.selectedMetric$.subscribe(metric => {
      console.log('new metric');
      this.selectedMetric = metric;

      this.isTable =
        this.selectedMetric &&
        this.selectedMetric.visualisation &&
        this.selectedMetric.visualisation.type === 'table';
      this.detectChanges();
    });
    this.isMobile = isMobileOrTablet();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
