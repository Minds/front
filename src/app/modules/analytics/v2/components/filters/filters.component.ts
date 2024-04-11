import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsDashboardService } from '../../dashboard.service';
import { Filter } from '../../../../../interfaces/dashboard';

@Component({
  selector: 'm-analytics__filters',
  templateUrl: './filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsFiltersComponent implements OnInit, OnDestroy {
  filterSubscription: Subscription;

  filters$ = this.analyticsService.filters$;
  filters: Filter[];

  timespanSubscription: Subscription;
  selectedTimespan;
  timespanFilter: Filter = {
    id: 'timespan',
    label: 'Timespan',
    options: [],
  };

  constructor(
    private analyticsService: AnalyticsDashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // TODO: remove all of this once channel search is ready
    // Temporarily remove channel search from channel filter options
    this.filterSubscription = this.analyticsService.filters$.subscribe(
      (filters) => {
        const channelFilter = filters.find((filter) => filter.id === 'channel');
        if (channelFilter) {
          channelFilter.options = channelFilter.options.filter((option) => {
            return option.id === 'all' || option.id === 'self';
          });
        }

        this.filters = filters;
        this.detectChanges();
      }
    );

    this.timespanSubscription = this.analyticsService.timespans$.subscribe(
      (timespans) => {
        this.timespanFilter.options = timespans;
        this.detectChanges();
      }
    );
  }

  selectionMade($event) {
    if ($event.filterId === 'timespan') {
      this.analyticsService.updateTimespan($event.option.id);
    } else {
      this.analyticsService.updateFilter(
        `${$event.filterId}::${$event.option.id}`
      );
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.timespanSubscription.unsubscribe();
  }
}
