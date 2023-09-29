import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  ReplaySubject,
  Subject,
} from 'rxjs';
import {
  debounceTime,
  map,
  scan,
  startWith,
  switchMap,
  switchMapTo,
  tap,
} from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../common/api/api.service';

export type InteractionType =
  | 'votes-up'
  | 'reminds'
  | 'quotes'
  | 'subscribers'
  | 'mutual-subscribers';

@Injectable()
export class InteractionsModalDataService {
  /**
   * The entity guid
   */
  entityGuid$: ReplaySubject<string> = new ReplaySubject();

  /**
   * When in progress
   */
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   */
  type$: BehaviorSubject<InteractionType> = new BehaviorSubject('votes-up');

  /**
   * Paging token
   */
  pagingToken$: BehaviorSubject<string | number> = new BehaviorSubject('');

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
  rawList$ = combineLatest([
    this.entityGuid$,
    this.type$,
    this.pagingToken$,
  ]).pipe(
    debounceTime(100), // Hack to prevent first cancelled call
    tap(_ => this.inProgress$.next(true)),
    switchMap(([entityGuid, type, pagingToken]) =>
      this.apiRequest(entityGuid, type, pagingToken)
    ),
    tap(response => {
      this.nextPagingToken$.next(response['load-next']);
    }),
    map(response => response.entities || []),
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

  apiRequest(
    entityGuid: string,
    type: InteractionType,
    pagingToken: string | number
  ): Observable<ApiResponse> {
    const limit = 24;
    switch (type) {
      case 'votes-up':
        return this.api
          .get('api/v3/votes/list/' + entityGuid, {
            limit,
            'next-page': pagingToken,
            direction: 'up',
          })
          .pipe(
            map(response => {
              const entities = response.votes.map(vote => {
                return vote.actor;
              });
              return {
                status: 'success',
                entities,
                'load-next': response['load-next'],
              };
            })
          );
      case 'reminds':
        return this.api
          .get('api/v3/newsfeed', {
            limit,
            'next-page': pagingToken,
            remind_guid: entityGuid,
          })
          .pipe(
            map(response => {
              response.entities = response.entities.map(entity => {
                if (entity?.remind_users && entity?.remind_users.length > 0) {
                  return entity.remind_users[0];
                }
              });
              return response;
            })
          );
      case 'quotes':
        return this.api.get('api/v3/newsfeed', {
          limit,
          'next-page': pagingToken,
          quote_guid: entityGuid,
        });
      case 'subscribers':
        return this.api.get(
          `api/v3/subscriptions/graph/${entityGuid}/subscribers`,
          {
            limit,
            from_timestamp: pagingToken,
          }
        );
      case 'mutual-subscribers':
        const offset = (pagingToken as number) || 0;
        return this.api
          .get(`api/v3/subscriptions/relational/also-subscribe-to`, {
            guid: entityGuid,
            limit,
            offset,
          })
          .pipe(
            map(response => ({
              'load-next': response?.users?.length ? offset + limit : undefined,
              status: 'success',
              entities: response?.users || [],
            }))
          );
    }
  }

  async loadNext(pagingToken: string) {
    this.pagingToken$.next(pagingToken);

    if (this.type$.getValue() === 'reminds') {
    }
  }
}
