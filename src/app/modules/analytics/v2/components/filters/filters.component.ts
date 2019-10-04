import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
  selector: 'm-analytics__filters',
  templateUrl: './filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsFiltersComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  filters$ = this.analyticsService.filters$;

  constructor(private analyticsService: AnalyticsDashboardService) {}

  ngOnInit() {
    // TODO: remove subscription because everything is happening in html
    // TODO: might even be fine to just get rid of this component and put it in dashboard.ts
  }

  ngOnDestroy() {
  }
}
