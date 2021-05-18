import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  concat,
  merge,
  Observable,
  of,
  race,
  Subject,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  scan,
  startWith,
  switchMap,
  switchMapTo,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { MindsUser } from '../../../interfaces/entities';

export type Notification = {
  uuid: string;
  entity: any;
  from: MindsUser;
  data: any[];
};

@Injectable()
export class NotificationsV3Service {
  /**
   * When in progress
   */
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * The filters
   * '' is all
   */
  filter$: BehaviorSubject<string> = new BehaviorSubject('');

  /**
   * Paging token
   */
  pagingToken$: BehaviorSubject<string> = new BehaviorSubject('');

  /**
   * Paging token
   */
  nextPagingToken$: Subject<string> = new Subject();

  /**
   * Reset request
   */
  requestListAt$: BehaviorSubject<number> = new BehaviorSubject(0);

  /**
   * The raw list of notifications
   */
  rawList$ = combineLatest([this.filter$, this.pagingToken$]).pipe(
    tap(_ => this.inProgress$.next(true)),
    switchMap(([filter, pagingToken]) => this.apiRequest(filter, pagingToken)),
    tap(response => {
      this.nextPagingToken$.next(response['load-next']);
    }),
    map(response => response.notifications || []),
    tap(_ => this.inProgress$.next(false)),
    scan((a, c) => [...a, ...c], [])
  );

  /**
   * The list of notifications
   */
  list$ = this.requestListAt$.pipe(
    startWith(0),
    switchMapTo(this.rawList$.pipe())
  );

  constructor(private api: ApiService) {}

  apiRequest(filter: string, pagingToken: string): Observable<ApiResponse> {
    return this.api.get('api/v3/notifications/list', {
      filter,
      limit: 24,
      offset: pagingToken,
    });
  }

  async loadNext(pagingToken: string) {
    this.pagingToken$.next(pagingToken);
  }
}
