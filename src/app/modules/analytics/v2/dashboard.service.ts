import { Injectable } from '@angular/core';

import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  switchMap,
  startWith,
  tap,
  delay,
  debounceTime,
} from 'rxjs/operators';

import { Client } from '../../../services/api/client';

// TEMPORARY
import { HttpClient, HttpHeaders } from '@angular/common/http';
import fakeData from './fake';

export interface Category {
  id: string;
  label: string;
  type?: string; // TODO: probably remove this because it's in visualisations
  metrics?: string[]; // TODO: probably remove this too
}

export interface Response {
  status: string;
  dashboard: Dashboard;
}

export interface Dashboard {
  category: string;
  timespan: string;
  timespans: Timespan[];
  metric: Metric;
  metrics: Metric[];
  filter: string[];
  filters: Filter[];
}

export interface Filter {
  id: string;
  label: string;
  options: Option[];
}

export interface Option {
  id: string;
  label: string;
  available: boolean;
  selected: boolean;
}

export interface Metric {
  id: string;
  label: string;
  permissions: string[];
  summary: Summary;
  visualisation: Visualisation | null;
}

export interface Summary {
  current_value: number;
  comparison_value: number;
  comparison_interval: number;
  comparison_positive_inclination: boolean;
}

export interface Visualisation {
  type: string;
  buckets: Bucket[];
}

export interface Bucket {
  key: number;
  date: string;
  value: number;
}

export interface Timespan {
  id: string;
  label: string;
  interval: string;
  comparison_interval: number;
  from_ts_ms: number;
  from_ts_iso: string;
}

export interface UserState {
  category: string;
  timespan: string;
  timespans: Timespan[];
  metric: Metric;
  metrics: Metric[];
  filter: string[];
  filters: Filter[];
  loading: boolean;
}

let _state: UserState = {
  category: 'traffic',
  timespan: '30d',
  timespans: [
    {
      id: 'today',
      label: 'today',
      interval: 'day',
      comparison_interval: 1,
      from_ts_ms: 1569888000000,
      from_ts_iso: '2019-10-01T00:00:00+00:00',
    },
    {
      id: '30d',
      label: 'Last 30 days',
      interval: 'day',
      comparison_interval: 28,
      from_ts_ms: 1567296000000,
      from_ts_iso: '2019-09-01T00:00:00+00:00',
    },
    {
      id: '1y',
      label: '1 year ago',
      interval: 'month',
      comparison_interval: 365,
      from_ts_ms: 1538352000000,
      from_ts_iso: '2018-10-01T00:00:00+00:00',
    },
    {
      id: 'mtd',
      label: 'month to date',
      interval: 'day',
      comparison_interval: 28,
      from_ts_ms: 1569888000000,
      from_ts_iso: '2019-10-01T00:00:00+00:00',
    },
    {
      id: 'ytd',
      label: 'year to date',
      interval: 'month',
      comparison_interval: 365,
      from_ts_ms: 1546300800000,
      from_ts_iso: '2019-01-01T00:00:00+00:00',
    },
  ],
  metric: {
    id: 'views',
    label: 'views',
    permissions: ['admin'],
    summary: {
      current_value: 83898,
      comparison_value: 0,
      comparison_interval: 28,
      comparison_positive_inclination: true,
    },
    visualisation: {
      type: 'chart',
      buckets: [
        {
          key: 1567296000000,
          date: '2019-09-01T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1567382400000,
          date: '2019-09-02T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1567468800000,
          date: '2019-09-03T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1567555200000,
          date: '2019-09-04T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1567641600000,
          date: '2019-09-05T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1567728000000,
          date: '2019-09-06T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1567814400000,
          date: '2019-09-07T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1567900800000,
          date: '2019-09-08T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1567987200000,
          date: '2019-09-09T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1568073600000,
          date: '2019-09-10T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1568160000000,
          date: '2019-09-11T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1568246400000,
          date: '2019-09-12T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1568332800000,
          date: '2019-09-13T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1568419200000,
          date: '2019-09-14T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1568505600000,
          date: '2019-09-15T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1568592000000,
          date: '2019-09-16T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1568678400000,
          date: '2019-09-17T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1568764800000,
          date: '2019-09-18T00:00:00+00:00',
          value: 0,
        },
        {
          key: 1568851200000,
          date: '2019-09-19T00:00:00+00:00',
          value: 9565,
        },
        {
          key: 1568937600000,
          date: '2019-09-20T00:00:00+00:00',
          value: 10821,
        },
        {
          key: 1569024000000,
          date: '2019-09-21T00:00:00+00:00',
          value: 10674,
        },
        {
          key: 1569110400000,
          date: '2019-09-22T00:00:00+00:00',
          value: 10494,
        },
        {
          key: 1569196800000,
          date: '2019-09-23T00:00:00+00:00',
          value: 11203,
        },
        {
          key: 1569283200000,
          date: '2019-09-24T00:00:00+00:00',
          value: 14034,
        },
        {
          key: 1569369600000,
          date: '2019-09-25T00:00:00+00:00',
          value: 11618,
        },
        {
          key: 1569456000000,
          date: '2019-09-26T00:00:00+00:00',
          value: 5489,
        },
        {
          key: 1569542400000,
          date: '2019-09-27T00:00:00+00:00',
          value: 0,
        },
      ],
    },
  },
  metrics: [
    {
      id: 'active_users',
      label: 'Active Users',
      permissions: ['admin'],
      summary: {
        current_value: 120962,
        comparison_value: 120962,
        comparison_interval: 28,
        comparison_positive_inclination: true,
      },
      visualisation: null,
    },
    {
      id: 'signups',
      label: 'Signups',
      permissions: ['admin'],
      summary: {
        current_value: 53060,
        comparison_value: 60577,
        comparison_interval: 28,
        comparison_positive_inclination: true,
      },
      visualisation: null,
    },
    {
      id: 'views',
      label: 'Pageviews',
      permissions: ['admin'],
      summary: {
        current_value: 83898,
        comparison_value: 0,
        comparison_interval: 28,
        comparison_positive_inclination: true,
      },
      visualisation: {
        type: 'chart',
        buckets: [
          {
            key: 1567296000000,
            date: '2019-09-01T00:00:00+00:00',
            value: 1,
          },
          {
            key: 1567382400000,
            date: '2019-09-02T00:00:00+00:00',
            value: 2,
          },
          {
            key: 1567468800000,
            date: '2019-09-03T00:00:00+00:00',
            value: 3,
          },
          {
            key: 1567555200000,
            date: '2019-09-04T00:00:00+00:00',
            value: 4,
          },
          {
            key: 1567641600000,
            date: '2019-09-05T00:00:00+00:00',
            value: 5,
          },
          {
            key: 1567296000000,
            date: '2019-08-01T00:00:00+00:00',
            value: 5.5,
          },
          {
            key: 1567382400000,
            date: '2019-08-02T00:00:00+00:00',
            value: 4.5,
          },
          {
            key: 1567468800000,
            date: '2019-08-03T00:00:00+00:00',
            value: 3.5,
          },
          {
            key: 1567555200000,
            date: '2019-08-04T00:00:00+00:00',
            value: 2.5,
          },
          {
            key: 1567641600000,
            date: '2019-08-05T00:00:00+00:00',
            value: 1.5,
          },
        ],
      },
    },
  ],
  filter: ['platform::all', 'view_type::single', 'channel::all'],
  filters: [
    {
      id: 'platform',
      label: 'Platform',
      options: [
        { id: 'all', label: 'All', available: true, selected: false },
        {
          id: 'browser',
          label: 'Browser',
          available: true,
          selected: false,
        },
        { id: 'mobile', label: 'Mobile', available: true, selected: false },
      ],
    },
    {
      id: 'view_type',
      label: 'View Type',
      options: [
        { id: 'total', label: 'Total', available: true, selected: false },
        {
          id: 'organic',
          label: 'Organic',
          available: true,
          selected: true,
        },
        {
          id: 'boosted',
          label: 'Boosted',
          available: false,
          selected: false,
        },
        { id: 'single', label: 'Single', available: true, selected: false },
      ],
    },
  ],
  loading: false,
};

// **********************************************************************
// **********************************************************************

@Injectable()
export class AnalyticsDashboardService {
  data = fakeData;

  /**
   * Initialize the state subject and make it an observable
   */
  private store = new BehaviorSubject<UserState>(_state);
  private state$ = this.store.asObservable();

  // Make all the different variables within the UserState observables
  // that are emitted only when something inside changes
  category$ = this.state$.pipe(
    map(state => state.category),
    distinctUntilChanged()
  );
  timespan$ = this.state$.pipe(
    map(state => state.timespan),
    distinctUntilChanged()
  );
  timespans$ = this.state$.pipe(
    map(state => state.timespans),
    distinctUntilChanged()
  );
  metric$ = this.state$.pipe(
    map(state => state.metric),
    distinctUntilChanged()
  );
  metrics$ = this.state$.pipe(
    map(state => state.metrics),
    distinctUntilChanged()
  );
  filter$ = this.state$.pipe(
    map(state => state.filter),
    distinctUntilChanged()
  );
  filters$ = this.state$.pipe(
    map(state => state.filters),
    distinctUntilChanged()
  );
  loading$ = this.state$.pipe(map(state => state.loading));

  /**
   * Viewmodel that resolves once all the data is ready (or updated)
   */
  vm$: Observable<UserState> = combineLatest(
    this.category$,
    this.timespan$,
    this.timespans$,
    this.metric$,
    this.metrics$,
    this.filter$,
    this.filters$,
    this.loading$
  ).pipe(
    map(
      ([
        category,
        timespan,
        timespans,
        metric,
        metrics,
        filter,
        filters,
        loading,
      ]) => {
        return {
          category,
          timespan,
          timespans,
          metric,
          metrics,
          filter,
          filters,
          loading,
        };
      }
    )
  );

  /**
   * Watch 5 streams to trigger user loads and state updates
   */
  // TODO:  remove one of these later
  constructor(private client: Client, private httpClient: HttpClient) {
    // combineLatest([this.category$, this.timespan$, this.metric$, this.filter$])
    //   .pipe(
    //     switchMap(([category, timespan, metric, filter]) => {
    //       return this.getDashboardResponse(category, timespan, metric, filter);
    //     })
    //   )
    //   .subscribe(response => {
    //     const dashboard = response.dashboard;

    //     this.updateState({
    //       ..._state,
    //       category: dashboard.category,
    //       timespan: dashboard.timespan,
    //       filter: dashboard.filter,
    //       loading: false,
    //     });
    //   });
    this.loadFromRemote();
  }

  loadFromRemote() {
    combineLatest([this.category$, this.timespan$, this.metric$, this.filter$])
      .pipe(
        switchMap(([category, timespan, metric, filter]) => {
          return this.getDashboardResponse(category, timespan, metric, filter);
        })
      )
      .subscribe(response => {
        const dashboard = response.dashboard;

        this.updateState({
          ..._state,
          category: dashboard.category,
          timespan: dashboard.timespan,
          filter: dashboard.filter,
          loading: false,
        });
      });
  }

  // ------- Public Methods ------------------------

  // Allows quick snapshot access to data for ngOnInit() purposes
  getStateSnapshot(): UserState {
    return {
      ..._state,
      timespans: { ..._state.timespans },
      metrics: { ..._state.metrics },
      filters: { ..._state.filters },
    };
  }

  // TODO: implement channel filter
  // buildchannelSearchControl(): FormControl {
  //   const channelSearch = new FormControl();
  //   channelSearch.valueChanges
  //     .pipe(
  //       debounceTime(300),
  //       distinctUntilChanged()
  //     )
  //     .subscribe(value => this.updateSearchCriteria(value));

  //   return channelSearch;
  // }

  // TODO: this in UpdateFilter() instead
  // updateSearchCriteria(criteria: string) {
  //   this.updateState({ ..._state, criteria, loading: true });
  // }

  updateCategory(category: string) {
    this.updateState({ ..._state, category, loading: true });
  }
  updateTimespan(timespan: string) {
    this.updateState({ ..._state, timespan, loading: true });
  }
  updateMetric(metric: Metric) {
    this.updateState({ ..._state, metric, loading: true });
  }
  updateFilter(filter: string[]) {
    // TODO: this should replace the sameFilterId::filterOption
    // there should always be a channel filter?
    // const filterStr = { ..._state.filter, currentPage, selectedSize };
    this.updateState({ ..._state, filter, loading: true });
  }

  //   // ------- Private Methods ------------------------

  /** Update internal state cache and emit from store... */
  private updateState(state: UserState) {
    this.store.next((_state = state));
  }

  /** Dashboard REST call */
  private getDashboardResponse(
    category: string,
    timespan: string,
    metric: Metric,
    filter: string[]
  ): Observable<Response> {
    const url = buildQueryUrl(category, timespan, metric, filter);
    // return this.client.get<Response>(url).pipe(map(response => response));
    return this.httpClient.get<Response>(url).pipe(map(response => response));
  }

  getData() {
    return this.data[0].dashboard;
  }
}

function buildQueryUrl(
  category: string,
  timespan: string,
  metric: Metric,
  filter: string[]
): string {
  const url = 'https://walrus.minds.com/api/v2/analytics/dashboards/';
  const filterStr: string = filter.join();
  const metricId: string = metric.id;

  return `${url}${category}?metric=${metricId}&timespan=${timespan}&filter=${filterStr}`;
}

// https://walrus.minds.com/api/v2/analytics/dashboards/traffic?metric=views&timespan=mtd&filters=view_type::single,channel::self
// async getData() {
//   const response: any = await this.client.get(
//     `api/v2/analytics/offchainwire`,
//     { timespan: this.timespan }
//   );
// }
