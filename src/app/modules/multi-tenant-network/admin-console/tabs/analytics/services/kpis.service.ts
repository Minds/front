import { Injectable } from '@angular/core';
import {
  AnalyticsMetricEnum,
  GetAdminAnalyticsChartAndKpisGQL,
  GetAdminAnalyticsChartAndKpisQuery,
  GetAdminAnalyticsChartAndKpisQueryVariables,
} from '../../../../../../../graphql/generated.engine';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../../../common/services/toaster.service';
import * as moment from 'moment';

/** Default analytics chart and KPIs query parameters. */
const DEFAULT_PARAMS: GetAdminAnalyticsChartAndKpisQueryVariables = {
  chartMetric: AnalyticsMetricEnum.DailyActiveUsers,
  kpiMetrics: [
    AnalyticsMetricEnum.TotalUsers,
    AnalyticsMetricEnum.DailyActiveUsers,
    AnalyticsMetricEnum.MeanSessionSecs,
    AnalyticsMetricEnum.Visitors,
    AnalyticsMetricEnum.TotalSiteMembershipSubscriptions,
  ],
  fromUnixTs: moment()
    .subtract(30, 'days')
    .unix(),
  toUnixTs: moment().unix(),
};

/**
 * Service for fetching network admin analytics KPIs.
 */
@Injectable({ providedIn: 'root' })
export class NetworkAdminAnalyticsKpisService {
  /** Internal subject to hold whether a request is in progress. */
  private readonly _inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  /** Exposed observable that represents whether a request is in progress. */
  public readonly inProgress$: Observable<
    boolean
  > = this._inProgress$.asObservable();

  /** Internal subject to hold the parameters for the analytics chart and KPIs query. */
  private readonly params$: BehaviorSubject<
    GetAdminAnalyticsChartAndKpisQueryVariables
  > = new BehaviorSubject<GetAdminAnalyticsChartAndKpisQueryVariables>(
    DEFAULT_PARAMS
  );

  /**
   * Data observable for the analytics chart and KPIs query. Will pull data from the
   * server on initial subscribe, and update on param change.
   */
  public readonly data$: Observable<
    GetAdminAnalyticsChartAndKpisQuery
  > = this.params$.pipe(
    tap(() => this._inProgress$.next(true)),
    switchMap(params => {
      return this.getTenantAnalyticsChartAndKpisGql.fetch(params, {
        fetchPolicy: 'network-only',
      });
    }),
    map(result => {
      if (!result) {
        throw new Error('No results found');
      }

      if (result?.errors?.length) {
        throw new Error(result.errors[0].message);
      }

      this._inProgress$.next(false);
      return result.data;
    }),
    catchError((e: any) => {
      console.error(e);
      this._inProgress$.next(false);
      this.toaster.error(e?.message ?? DEFAULT_ERROR_MESSAGE);
      return of(null);
    }),
    finalize(() => this._inProgress$.next(false)),
    shareReplay()
  );

  constructor(
    private getTenantAnalyticsChartAndKpisGql: GetAdminAnalyticsChartAndKpisGQL,
    private toaster: ToasterService
  ) {}

  /**
   * Patch the parameters for the analytics chart and KPIs query.
   * @param { Partial<GetAdminAnalyticsChartAndKpisQueryVariables> } params - the parameters to patch.
   * @returns { void }
   */
  public patchParams(
    params: Partial<GetAdminAnalyticsChartAndKpisQueryVariables>
  ): void {
    this.params$.next({
      ...this.params$.getValue(),
      ...params,
    });
  }
}
