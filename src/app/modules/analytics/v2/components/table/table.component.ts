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
  Visualisation,
} from '../../dashboard.service';

@Component({
  selector: 'm-analytics__table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsTableComponent implements OnInit, OnDestroy {
  metricSubscription: Subscription;
  visualisation: Visualisation;
  columns: Array<any>;
  rows: Array<any>;
  reformattedBuckets: Array<any> = [];
  user;
  loadingSubscription: Subscription;
  loading: boolean;
  valueColCount: number = 1;

  selectedMetric$ = this.analyticsService.metrics$.pipe(
    map(metrics => {
      return metrics.find(metric => metric.visualisation !== null);
    })
  );
  selectedMetric;
  constructor(
    private analyticsService: AnalyticsDashboardService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.metricSubscription = this.selectedMetric$.subscribe(metric => {
      this.selectedMetric = metric;
      this.visualisation = metric.visualisation;
      this.columns = metric.visualisation.columns;
      this.valueColCount = this.columns.length - 1;

      this.loadingSubscription = this.analyticsService.loading$.subscribe(
        loading => {
          this.loading = loading;
          this.detectChanges();
        }
      );

      this.reformatBuckets();
      this.detectChanges();
    });
  }

  reformatBuckets() {
    this.reformattedBuckets = [];
    this.visualisation.buckets.forEach(bucket => {
      const reformattedBucket = {};
      const reformattedValues = [];

      if (!bucket.values['entity']) {
        return;
      }

      this.columns.forEach((column, i) => {
        if (i === 0) {
          reformattedBucket['entity'] = this.reformatEntity(
            bucket.values['entity']
          );
        } else {
          reformattedValues.push(bucket.values[column.id]);
        }
      });
      reformattedBucket['values'] = reformattedValues;
      this.reformattedBuckets.push(reformattedBucket);
    });
  }

  reformatEntity(entity) {
    let type, username, name, titleType;
    if (entity.remind_object) {
      type = 'remind';
    } else {
      type = entity.urn.split(':')[1];
    }
    if (type === 'user') {
      type = 'channel';
      username = entity.username;
      name = entity.name;
    } else {
      username = entity.ownerObj.username;
      name = entity.ownerObj.name;
    }

    titleType = type.charAt(0).toUpperCase() + type.slice(1);
    if (type === 'activity') {
      titleType = 'Post';
    }

    const reformattedEntity = {
      type: type,
      time_created: entity.time_created || entity.time_published,
      title: entity.title || entity.message || `${username}'s ${titleType}`,
      route: this.getEntityRoute(type, entity),
      username: username,
      name: name,
    };

    return reformattedEntity;
  }

  getEntityRoute(type, entity) {
    const routesByType = [
      {
        ids: ['image', 'video'],
        route: '/media/' + entity.urn.split(':')[2],
      },

      {
        ids: ['activity', 'remind'],
        route: `/newsfeed/${entity.urn.split(':')[2]}`,
      },
      {
        ids: ['blog'],
        route: entity.route,
      },
      {
        ids: ['channel'],
        route: '/' + entity.name,
      },
    ];

    return routesByType.find(t => t.ids.indexOf(type) > -1).route;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.metricSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }
}
