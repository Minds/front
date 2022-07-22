import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnalyticsDashboardService } from '../../dashboard.service';
import { DataTab } from '../../../../../interfaces/dashboard';
import { Session } from '../../../../../services/session';

@Component({
  selector: 'm-analytics__layout--chart',
  templateUrl: './layout-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsLayoutChartComponent implements OnInit, OnDestroy {
  user;
  userRoles: string[] = ['user'];

  tabs: DataTab[] = [];
  activeTabId: string = '';

  metricsSubscription: Subscription;
  selectedMetricSubscription: Subscription;

  loading$ = this.analyticsService.loading$;
  metrics$;
  selectedMetric$ = combineLatest(
    this.analyticsService.metrics$,
    this.analyticsService.metric$
  ).pipe(
    map(([metrics, id]) => {
      return metrics.find(metric => metric.id === id);
    })
  );
  selectedMetric;
  isTable: boolean = false;

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

    this.selectedMetricSubscription = this.selectedMetric$.subscribe(metric => {
      this.selectedMetric = metric;

      this.isTable =
        this.selectedMetric &&
        this.selectedMetric.visualisation &&
        this.selectedMetric.visualisation.type === 'table';
      this.detectChanges();
    });

    this.metricsSubscription = this.analyticsService.metrics$.subscribe(
      metrics => {
        this.tabs = [];
        for (const metric of metrics) {
          const permissionGranted = metric.permissions.some(role =>
            this.userRoles.includes(role)
          );

          const tab: DataTab = {
            id: metric.id,
            label: metric.label,
          };

          if (metric.visualisation) {
            this.activeTabId = metric.id;
          }

          tab.unit = metric.unit ? metric.unit : null;
          tab.description = metric.description ? metric.description : null;

          if (metric.summary) {
            tab.value = metric.summary.current_value;
            if (metric.summary.comparison_value !== 0) {
              tab.delta =
                (metric.summary.current_value -
                  metric.summary.comparison_value) /
                (metric.summary.comparison_value || 0);
            } else {
              tab.delta = 1;
            }
            tab.hasChanged = tab.delta === 0 ? false : true;

            if (
              (tab.delta > 0 &&
                metric.summary.comparison_positive_inclination) ||
              (tab.delta < 0 && !metric.summary.comparison_positive_inclination)
            ) {
              tab.positiveTrend = true;
            } else {
              tab.positiveTrend = false;
            }
          }
          if (permissionGranted) {
            this.tabs.push(tab);
          }
          this.detectChanges();
        }
      }
    );
  }

  updateMetric($event) {
    this.activeTabId = $event.tabId;
    this.analyticsService.updateMetric($event.tabId);
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.selectedMetricSubscription.unsubscribe();
    this.metricsSubscription.unsubscribe();
  }
}
