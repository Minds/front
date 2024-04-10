import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, ReplaySubject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  shareReplay,
  switchAll,
  tap,
} from 'rxjs/operators';
import { ApiService } from '../../../../common/api/api.service';
import { MindsUser } from '../../../../interfaces/entities';

@Injectable({ providedIn: 'root' })
export class MutualSubscriptionsService {
  /**
   * The userGuid that the query should be performed on
   */
  userGuid$: ReplaySubject<string> = new ReplaySubject();

  /**
   * Performs the API response. Depends on userGuid$ value
   */
  apiResponse$: Observable<any> = this.userGuid$.pipe(
    distinctUntilChanged(),
    tap(() => {
      this.inProgress$.next(true);
    }),
    map((userGuid) => {
      return this.api
        .get('api/v3/subscriptions/relational/also-subscribe-to', {
          guid: userGuid,
        })
        .pipe(
          catchError((e) => {
            return EMPTY;
          })
        );
    }),
    switchAll(),
    shareReplay({ bufferSize: 1, refCount: true }),
    tap(() => {
      this.inProgress$.next(false);
    })
  );

  /**
   * A list of users that gets returned from apiResponse$
   */
  users$: Observable<MindsUser[]> = this.apiResponse$.pipe(
    map((apiResponse) => {
      return apiResponse.users;
    })
  );

  /**
   * The total amount of mutual subscribers, returned from apiResponse$
   */
  totalCount$: Observable<number> = this.apiResponse$.pipe(
    map((apiResponse) => {
      return apiResponse.count;
    })
  );

  /**
   * The inProgress state.
   */
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private api: ApiService) {}
}
