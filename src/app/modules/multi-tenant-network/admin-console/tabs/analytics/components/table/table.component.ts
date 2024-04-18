import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AnalyticsTableEnum,
  AnalyticsTableRowEdge,
  PageInfo,
} from '../../../../../../../../graphql/generated.engine';
import { NetworkAdminAnalyticsTableService } from '../../services/table.service';
import { Observable, Subscription, combineLatest, map } from 'rxjs';
import {
  DEFAULT_TIMESPAN_FILTER_ID,
  NetworkAdminAnalyticsTimespanFiltersService,
} from '../../services/timespan-filters.service';
import { Option } from '../../../../../../../interfaces/dashboard';
import { WINDOW } from '../../../../../../../common/injection-tokens/common-injection-tokens';

/**
 * Paginated network analytics table component. Shows metrics
 * relevant to a given table type.
 */
@Component({
  selector: 'm-networkAdminAnalytics__table',
  styleUrls: ['./table.component.ng.scss'],
  templateUrl: './table.component.html',
  providers: [NetworkAdminAnalyticsTableService],
})
export class NetworkAdminAnalyticsTableComponent implements OnInit, OnDestroy {
  /** Enum for use in template. */
  protected readonly AnalyticsTableEnum: typeof AnalyticsTableEnum =
    AnalyticsTableEnum;

  /** Whether a request is in progress to load / load more. */
  protected readonly inProgress$: Observable<boolean> =
    this.tableService.inProgress$;

  /** Whether the component has been intiialized. */
  protected readonly initialized$: Observable<boolean> =
    this.tableService.initialized$;

  /** Whether the paginated list has a next page. */
  protected readonly hasNextPage$: Observable<boolean> =
    this.tableService.pageInfo$.pipe(
      map((pageInfo: PageInfo) => pageInfo?.hasNextPage)
    );

  /** List of analytics tabs row edges from service. */
  protected edges$: Observable<AnalyticsTableRowEdge[]> =
    this.tableService.edges$;

  /** type of analytics table to be shown - drawn from route data. */
  protected type: AnalyticsTableEnum;

  /** Currently selected timespan option. */
  private selectedTimespanOption: Option;

  /** Subscription to route params. */
  private routeParamSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private tableService: NetworkAdminAnalyticsTableService,
    private timespanFiltersService: NetworkAdminAnalyticsTimespanFiltersService,
    @Inject(WINDOW) private readonly window: Window
  ) {}

  ngOnInit(): void {
    this.routeParamSubscription = combineLatest([
      this.route.queryParams,
      this.route.params,
    ]).subscribe(([queryParams, params]) => {
      this.type = this.parseTableEnumTypeFromString(
        params?.['typeParam'] ?? ''
      );
      this.selectedTimespanOption = this.timespanFiltersService.getOptionById(
        queryParams?.['timespan'] ?? DEFAULT_TIMESPAN_FILTER_ID
      );
      this.tableService.init(
        this.type,
        this.selectedTimespanOption.from_ts_ms,
        this.timespanFiltersService.instantiationTimestamp.unix()
      );
    });
  }

  ngOnDestroy(): void {
    this.routeParamSubscription?.unsubscribe();
  }

  /**
   * Fetches more data from the server.
   * @returns { void }
   */
  protected fetchMore(): void {
    this.tableService.fetchMore();
  }

  /**
   * Handles row click event based on the type of edge passed.
   * @param { AnalyticsTableRowEdge } edge - the edge that was clicked.
   * @returns { void }
   */
  protected handleTableRowClick(edge: AnalyticsTableRowEdge): void {
    // we have to forego full typing here because a quirk in our GraphQL codegen messes with type inheritance.
    switch ((edge?.node as any)?.__typename) {
      case 'AnalyticsTableRowActivityNode':
        this.window.open(
          `/newsfeed/${(edge.node as any).activity.guid}`,
          '_blank'
        );
        break;
      case 'AnalyticsTableRowGroupNode':
        this.window.open(
          `/group/${(edge.node as any).group.guid}/latest`,
          '_blank'
        );
        break;
      case 'AnalyticsTableRowUserNode':
        this.window.open(`/${(edge.node as any).user.username}`, '_blank');
        break;
      default:
        console.warn(
          'Invalid type provided to analytics row click event. Doing nothing'
        );
        break;
    }
  }

  /**
   * Parses the table enum type from a string.
   * @param { string } typeString - string to parse.
   * @returns { AnalyticsTableEnum } - parsed enum from typeString.
   */
  private parseTableEnumTypeFromString(typeString: string): AnalyticsTableEnum {
    switch (typeString) {
      case 'posts':
        return AnalyticsTableEnum.PopularActivities;
      case 'groups':
        return AnalyticsTableEnum.PopularGroups;
      case 'channels':
        return AnalyticsTableEnum.PopularUsers;
      default:
        console.warn(
          'Invalid type provided to analytics table. Defaulted to posts.'
        );
        return AnalyticsTableEnum.PopularActivities;
    }
  }
}
