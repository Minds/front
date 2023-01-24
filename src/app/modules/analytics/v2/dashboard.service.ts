import { Injectable } from '@angular/core';

import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  switchMap,
  tap,
  catchError,
} from 'rxjs/operators';

import { MindsHttpClient } from '../../../common/api/client.service';
import fakeData from './fake-data';
import { Response, UserState } from '../../../interfaces/dashboard';

// Populate state with fakeData because BehaviorSubject requires a starting value
let _state: UserState = fakeData[0];

// Compare objs
const deepDiff = (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr);

@Injectable()
export class AnalyticsDashboardService {
  // Initialize the BehaviorSubject with fakeData
  private store = new BehaviorSubject<UserState>(_state);
  private state$ = this.store.asObservable();

  // Make all the different variables within the UserState observables
  // Emit the observable when something inside changes
  category$ = this.state$.pipe(
    map(state => state.category),
    distinctUntilChanged(deepDiff)
  );
  description$ = this.state$.pipe(
    map(state => state.description),
    distinctUntilChanged()
  );
  timespan$ = this.state$.pipe(
    map(state => state.timespan),
    distinctUntilChanged(deepDiff)
  );
  timespans$ = this.state$.pipe(
    map(state => state.timespans),
    distinctUntilChanged(deepDiff)
  );
  metric$ = this.state$.pipe(
    map(state => state.metric),
    distinctUntilChanged(deepDiff)
  );
  metrics$ = this.state$.pipe(
    map(state => state.metrics),
    distinctUntilChanged(deepDiff)
  );
  filter$ = this.state$.pipe(
    map(state => state.filter),
    distinctUntilChanged(deepDiff)
  );
  filters$ = this.state$.pipe(
    map(state => state.filters),
    distinctUntilChanged(deepDiff)
  );
  loading$ = new BehaviorSubject<boolean>(false);
  ready$ = new BehaviorSubject<boolean>(false);

  /**
   * Viewmodel that resolves once all the data is ready (or updated)
   */
  vm$: Observable<UserState> = new BehaviorSubject(_state);

  constructor(private http: MindsHttpClient) {
    this.loadFromRemote();
  }

  loadFromRemote() {
    // whenever an observable emits a value, emit the last emitted value from each of the other observables
    combineLatest([this.category$, this.timespan$, this.metric$, this.filter$])
      .pipe(
        distinctUntilChanged(deepDiff),
        catchError(_ => {
          console.log('caught error');
          return of(null);
        }),
        tap(() => this.loading$.next(true)),
        switchMap(([category, timespan, metric, filter]) => {
          try {
            const response = this.getDashboardResponse(
              category,
              timespan,
              metric,
              filter
            );
            return response;
          } catch (err) {
            return null;
          }
        }),
        catchError(_ => of(null))
      )
      .subscribe(response => {
        if (!response) {
          return;
        }
        const dashboard = response.dashboard;
        this.ready$.next(true);

        this.updateState({
          ..._state,
          category: dashboard.category,
          description: dashboard.description,
          timespan: dashboard.timespan,
          timespans: dashboard.timespans,
          filter: dashboard.filter,
          filters: dashboard.filters,
          metric: dashboard.metric,
          metrics: dashboard.metrics,
        });
        this.loading$.next(false);
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

  updateCategory(category: string) {
    this.updateState({
      ..._state,
      category,
      description: null,
      metrics: [],
    });
  }
  updateTimespan(timespan: string) {
    this.updateState({
      ..._state,
      timespan,
    });
  }
  updateMetric(metric: string) {
    this.updateState({ ..._state, metric });
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

    this.updateState({ ..._state, filter });
  }

  // ------- Private Methods ------------------------

  /** Update internal state cache and emit from store... */
  private updateState(state: UserState) {
    this.store.next((_state = state));
  }

  /** Dashboard REST call */
  private getDashboardResponse(
    category: string,
    timespan: string,
    metric: string,
    filter: string[]
  ): Observable<Response> {
    this.loading$.next(true);
    return this.http
      .get(`api/v2/analytics/dashboards/${category}`, {
        metric,
        timespan,
        filter: filter.join(),
      })
      .pipe(
        catchError(_ => of(null)),
        map(response => response)
      ) as Observable<Response>;
  }
}
