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
  throttleTime,
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
  metric: string;
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
  available?: boolean;
  selected?: boolean;
  interval?: string;
  comparison_interval?: number;
  from_ts_ms?: number;
  from_ts_iso?: string;
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
  segments: Array<Buckets>;
}

export interface Buckets {
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
  metric: string;
  metrics: Metric[];
  filter: string[];
  filters: Filter[];
  loading: boolean;
}

// ¯\_(ツ)_/¯
let _state: UserState = {
  loading: false,
  category: 'traffic',
  timespan: '30d',
  timespans: [
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
  metric: 'views',
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
        segments: [
          {
            buckets: [
              {
                key: 1567296000000,
                date: '2019-09-01T00:00:00+00:00',
                value: 11,
              },
              {
                key: 1567382400000,
                date: '2019-09-02T00:00:00+00:00',
                value: 12,
              },
              {
                key: 1567468800000,
                date: '2019-09-03T00:00:00+00:00',
                value: 13,
              },
              {
                key: 1567555200000,
                date: '2019-09-04T00:00:00+00:00',
                value: 9,
              },
              {
                key: 1567641600000,
                date: '2019-09-05T00:00:00+00:00',
                value: 5,
              },
            ],
          },
          {
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
            ],
          },
        ],
      },
    },
  ],
  // filter: ['platform::browser'],
  // filters: [],
  // metric: 'views',
  // metrics: [],
};

const deepDiff = (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr);

// **********************************************************************
// **********************************************************************

@Injectable()
export class AnalyticsDashboardService {
  /**
   * Initialize the state subject and make it an observable
   */
  private store = new BehaviorSubject<UserState>(_state);
  private state$ = this.store.asObservable();

  // Make all the different variables within the UserState observables
  // that are emitted only when something inside changes
  category$ = this.state$.pipe(
    map(state => state.category),
    distinctUntilChanged(deepDiff)
    //tap(category => console.log('category changed', category))
  );
  timespan$ = this.state$.pipe(
    map(state => state.timespan),
    distinctUntilChanged(deepDiff)
    //tap(timespan => console.log('timespan changed', timespan))
  );
  timespans$ = this.state$.pipe(
    map(state => state.timespans),
    distinctUntilChanged(deepDiff)
    //tap(timespans => console.log('timespans changed', timespans))
  );
  metric$ = this.state$.pipe(
    map(state => state.metric),
    distinctUntilChanged(deepDiff)
    //distinctUntilChanged((prev, curr) => {
    //  console.log('distinctUntilChanged() on metric$');
    //  console.log(JSON.stringify(prev), JSON.stringify(curr));
    //  return deepDiff(prev, curr);
    //}),
    //tap(metric => console.log('metric changed', metric))
  );
  metrics$ = this.state$.pipe(
    map(state => state.metrics),
    //distinctUntilChanged(deepDiff),
    distinctUntilChanged((prev, curr) => {
      //console.log(JSON.stringify(prev), JSON.stringify(curr));
      return deepDiff(prev, curr);
    }),
    tap(metrics => console.log('metrics changed', metrics))
  );
  filter$ = this.state$.pipe(
    map(state => state.filter),
    distinctUntilChanged(deepDiff)
    //tap(filter => console.log('filter changed', filter))
  );
  filters$ = this.state$.pipe(
    map(state => state.filters),
    distinctUntilChanged(deepDiff)
    //tap(filters => console.log('filters changed', filters))
  );
  loading$ = this.state$.pipe(
    map(state => state.loading),
    distinctUntilChanged()
  );
  ready$ = new BehaviorSubject<boolean>(false);

  /**
   * Viewmodel that resolves once all the data is ready (or updated)
   */
  /*vm$: Observable<UserState> = combineLatest(
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
    ),
  );*/
  vm$: Observable<UserState> = new BehaviorSubject(_state);

  /**
   * Watch 5 streams to trigger user loads and state updates
   */
  // TODO:  remove one of these later
  constructor(private client: Client, private httpClient: HttpClient) {
    this.loadFromRemote();
  }

  loadFromRemote() {
    combineLatest([this.category$, this.timespan$, this.metric$, this.filter$])
      .pipe(
        ///debounceTime(300),
        tap(() => console.log('load from remote called')),
        distinctUntilChanged(deepDiff),
        switchMap(([category, timespan, metric, filter]) => {
          console.log(category, timespan, metric, filter);
          return this.getDashboardResponse(category, timespan, metric, filter);
        })
      )
      .subscribe(response => {
        const dashboard = response.dashboard;
        this.ready$.next(true);

        this.updateState({
          ..._state,
          category: dashboard.category,
          timespan: dashboard.timespan,
          timespans: dashboard.timespans,
          filter: dashboard.filter,
          filters: dashboard.filters,
          metric: dashboard.metric,
          metrics: dashboard.metrics,
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
  // updateChannel(channel: string) {
  //   this.updateState({ ..._state, criteria, loading: true });
  // }

  updateCategory(category: string) {
    console.log('update category called: ' + category);
    this.updateState({ ..._state, category, loading: true });
  }
  updateTimespan(timespan: string) {
    console.log('update timespan called: ' + timespan);
    // if (timespan === _state.timespan) {
    //   return;
    // }
    this.updateState({ ..._state, timespan, loading: true });
  }
  updateMetric(metric: string) {
    console.log('update metric called: ' + metric);
    this.updateState({ ..._state, metric, loading: true });
  }
  updateFilter(selectedFilterStr: string) {
    if (_state.filter.includes(selectedFilterStr)) {
      return;
    }
    const selectedFilterId = selectedFilterStr.split('::')[0];
    const filter = _state.filter;
    const activeFilterIds = filter.map(filterStr => {
      return filterStr.split('::')[0];
    });
    const filterIndex = activeFilterIds.findIndex(
      filterId => filterId === selectedFilterId
    );

    if (activeFilterIds.includes(selectedFilterId)) {
      filter.splice(filterIndex, 1, selectedFilterStr);
    } else {
      filter.push(selectedFilterStr);
    }
    console.log('update filter called: ' + selectedFilterStr);
    console.log(filter);

    this.updateState({ ..._state, filter, loading: true });
  }

  //   // ------- Private Methods ------------------------

  /** Update internal state cache and emit from store... */
  private updateState(state: UserState) {
    console.log('update state called');
    this.store.next((_state = state));
  }

  /** Dashboard REST call */
  private getDashboardResponse(
    category: string,
    timespan: string,
    metric: string,
    filter: string[]
  ): Observable<Response> {
    const url = buildQueryUrl(category, timespan, metric, filter);
    return this.httpClient.get<Response>(url).pipe(map(response => response));
  }

  getData() {
    console.warn('call was made to legacy function DashboardService.getData()');
  }
}

function buildQueryUrl(
  category: string,
  timespan: string,
  metric: string,
  filter: string[]
): string {
  const url = 'https://walrus.minds.com/api/v2/analytics/dashboards/';
  const filterStr: string = filter.join();
  const metricId: string = metric;
  const queryStr = `?metric=${metricId}&timespan=${timespan}&filter=${filterStr}`;

  return `${url}${category}${queryStr}`;
}
