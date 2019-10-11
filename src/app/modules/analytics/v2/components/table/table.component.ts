import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
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
  Metric,
  Summary,
  Visualisation,
  Bucket,
  Timespan,
  UserState,
  Buckets,
} from '../../dashboard.service';
@Component({
  selector: 'm-analytics__table',
  templateUrl: './table.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsTableComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  visualisation: Visualisation;
  columns: Array<any>;
  rows: Array<any>;
  reformattedBuckets: Array<any> = [];
  minds = window.Minds;

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
  constructor(
    private analyticsService: AnalyticsDashboardService // protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.selectedMetric$.subscribe(metric => {
      this.selectedMetric = metric;
      this.visualisation = metric.visualisation;
      this.columns = metric.visualisation.columns.sort((a, b) =>
        a.order > b.order ? 1 : -1
      );

      this.reformatBuckets();
    });
  }

  reformatBuckets() {
    this.visualisation.buckets.forEach(bucket => {
      const reformattedBucket = {};
      const reformattedValues = [];
      this.columns.forEach((column, i) => {
        if (i === 0) {
          reformattedBucket['entity'] = bucket.values[column.id];
        } else {
          reformattedValues.push(bucket.values[column.id]);
        }
      });
      reformattedBucket['values'] = reformattedValues;
      this.reformattedBuckets.push(reformattedBucket);
    });
    // TODO: reformat diff entity objs so template fields match
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
