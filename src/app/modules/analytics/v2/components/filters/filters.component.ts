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
  selector: 'm-analytics__filters',
  templateUrl: './filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsFiltersComponent implements OnInit {
  filters: Filter[];
  vm$: Observable<UserState> = this.analyticsService.vm$;
  constructor(private analyticsService: AnalyticsDashboardService) {}

  ngOnInit() {
    // console.log(this.analyticsService.getData());
    this.filters = this.analyticsService.getData().filters;
    // this.filters = this.vm$.filters;
  }
}
