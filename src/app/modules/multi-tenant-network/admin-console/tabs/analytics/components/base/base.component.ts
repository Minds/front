import { Component, OnInit } from '@angular/core';
import { NetworkAdminAnalyticsKpisService } from '../../services/kpis.service';
import { Observable } from 'rxjs';
import { GetAdminAnalyticsChartAndKpisQuery } from '../../../../../../../../graphql/generated.engine';
import { Filter, Option } from '../../../../../../../interfaces/dashboard';
import { DropdownSelectorSelection } from '../../../../../../../common/components/dropdown-selector/dropdown-selector.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DEFAULT_TIMESPAN_FILTER_ID,
  NetworkAdminAnalyticsTimespanFiltersService,
} from '../../services/timespan-filters.service';

/**
 * Base component for network admin analytics section.
 */
@Component({
  selector: 'm-networkAdminAnalytics__base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.ng.scss'],
})
export class NetworkAdminAnalyticsBaseComponent implements OnInit {
  /** Filters to be shown. */
  protected filters: Filter = this.timespanFiltersService.filters;

  /** Chart and KPIs data. */
  protected readonly data$: Observable<
    GetAdminAnalyticsChartAndKpisQuery
  > = this.kpisService.data$;

  /** Whether loading is in progress. */
  protected inProgress$: Observable<boolean> = this.kpisService.inProgress$;

  constructor(
    private kpisService: NetworkAdminAnalyticsKpisService,
    private timespanFiltersService: NetworkAdminAnalyticsTimespanFiltersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Set timespan from query params.
    this.updateTimespan(
      this.route.snapshot.queryParams['timespan'] ?? DEFAULT_TIMESPAN_FILTER_ID
    );
  }

  /**
   * Handles timespan selection.
   * @param { DropdownSelectorSelection } $event - selection event.
   * @returns { void }
   */
  public selectionMade($event: DropdownSelectorSelection): void {
    this.updateTimespan($event.option.id);
  }

  /**
   * Updates timespan, refetching service data and updating query param.
   * @param { string } timespanString - timespan string.
   * @returns { void }
   */
  private updateTimespan(timespanString: string): void {
    const option: Option = this.timespanFiltersService.getOptionById(
      timespanString
    );
    this.kpisService.patchParams({
      fromUnixTs: option?.from_ts_ms,
      toUnixTs: this.timespanFiltersService.instantiationTimestamp.unix(),
    });

    this.timespanFiltersService.forceSelectionById(option.id);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { timespan: timespanString },
      queryParamsHandling: 'merge',
    });
  }
}
