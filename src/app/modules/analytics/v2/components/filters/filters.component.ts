import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsDashboardService, Filter } from '../../dashboard.service';

@Component({
  selector: 'm-analytics__filters',
  templateUrl: './filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsFiltersComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  filters$ = this.analyticsService.filters$;
  filters: Filter[];

  constructor(
    private analyticsService: AnalyticsDashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // TODO: remove all of this once channel search is ready
    // Temporarily remove channel search from channel filter options
    this.subscription = this.analyticsService.filters$.subscribe(filters => {
      const channelFilter = filters.find(filter => filter.id === 'channel');
      if (channelFilter) {
        channelFilter.options = channelFilter.options.filter(option => {
          return option.id === 'all' || option.id === 'self';
        });
      }
      this.filters = filters;
      this.detectChanges();
    });
  }

  selectionMade($event) {
    this.analyticsService.updateFilter(
      `${$event.filterId}::${$event.option.id}`
    );
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
