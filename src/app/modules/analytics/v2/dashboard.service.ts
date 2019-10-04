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
  loading: false,
  category: 'traffic',
  timespan: '30d',
  timespans: [],
  filter: [ "platform::browser" ],
  filters: [ ],
  metric: { id: 'views' },
  metrics: [],
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
    distinctUntilChanged(deepDiff),
    tap(category => console.log('category changed', category)),
  );
  timespan$ = this.state$.pipe(
    map(state => state.timespan),
    distinctUntilChanged(deepDiff),
    tap(timespan => console.log('timespan changed', timespan))
  );
  timespans$ = this.state$.pipe(
    map(state => state.timespans),
    distinctUntilChanged(deepDiff),
    tap(timespans => console.log('timespans changed', timespans)),
  );
  metric$ = this.state$.pipe(
    map(state => state.metric),
    distinctUntilChanged(deepDiff),
    tap(metric => console.log('metric changed', metric))
  );
  metrics$ = this.state$.pipe(
    map(state => state.metrics),
    distinctUntilChanged(deepDiff),
    distinctUntilChanged((prev, curr) => {
      console.log(JSON.stringify(prev), JSON.stringify(curr));
      return deepDiff(prev, curr);
    }),
    tap(metrics => console.log('metrics changed', metrics))
  );
  filter$ = this.state$.pipe(
    map(state => state.filter),
    distinctUntilChanged(deepDiff),
    tap(filter => console.log('filter changed', filter)),
  );
  filters$ = this.state$.pipe(
    map(state => state.filters),
    distinctUntilChanged(deepDiff),
    tap(filters => console.log('filters changed', filters)),
  );
  loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
  ready$ = new BehaviorSubject<boolean>(false);

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
    ),
  );

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
        debounceTime(300),
        tap(() => console.log('load from remote called')),
        distinctUntilChanged(deepDiff),
        switchMap(([category, timespan, metric, filter]) => {
          console.log(category, timespan,  metric, filter);
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
    //const filterStr = { ..._state.filter, currentPage, selectedSize };
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
    metric: Metric,
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
  metric: Metric,
  filter: string[]
): string {
  const url = 'https://walrus.minds.com/api/v2/analytics/dashboards/';
  const filterStr: string = filter.join();
  const metricId: string = metric.id;

  return `${url}${category}?metric=${metricId}&timespan=${timespan}&filter=${filterStr}`;
}

