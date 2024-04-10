import { Injectable } from '@angular/core';
import { ApiService } from '../../../common/api/api.service';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

/** Affiliate metrics type. */
export type AffiliatesMetrics = {
  user_guid: string;
  amount_cents: number;
  amount_usd: number;
  amount_tokens: number;
} | null;

/**
 * Service for getting the logged in users affiliates metrics.
 */
@Injectable({ providedIn: 'root' })
export class AffiliatesMetricsService {
  constructor(private api: ApiService) {}

  /** whether request is in progress. */
  public readonly loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** whether request has errored.  */
  public readonly error$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Push to stream to reload. */
  public readonly reload$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Metrics from server */
  public readonly metrics$: Observable<AffiliatesMetrics> = this.reload$.pipe(
    // set loading state to true, and error state to false.
    tap((_) => {
      this.loading$.next(true);
      this.error$.next(false);
    }),
    // switch-map into api response.
    switchMap(
      (_: boolean): Observable<AffiliatesMetrics> =>
        this.api.get<AffiliatesMetrics>('api/v3/referrals/metrics')
    ),
    // catch any errors, set error state and explicitly return null.
    catchError((e: unknown): Observable<null> => {
      console.error(e);
      this.error$.next(true);
      return of(null);
    }),
    // set loading state to false.
    tap(() => this.loading$.next(false)),
    // share replay amongst subscribers.
    shareReplay()
  );
}
