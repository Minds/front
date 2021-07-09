import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map, shareReplay, switchMapTo, tap } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';

export type Metric = {
  id: string;
  offchain: string;
  onchain: string;
  total: string;
  format: 'token' | 'number' | 'usd' | 'points';
  comparative?: {
    offchain: string;
    onchain: string;
    total: string;
    total_diff: number;
  };
};

@Injectable({ providedIn: 'root' })
export class AnalyticsGlobalTokensService {
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  metrics$: Observable<Metric[]> = this.api
    .get('api/v3/blockchain/metrics')
    .pipe(
      map(response => response.metrics),
      tap(() => this.inProgress$.next(false))
    );

  supply$: Observable<Metric[]> = this.metrics$.pipe(
    map(metrics =>
      Object.values(metrics).filter(
        metric => metric.id.indexOf('Supply\\') > -1
      )
    )
  );

  transactions$: Observable<Metric[]> = this.metrics$.pipe(
    map(metrics =>
      Object.values(metrics).filter(
        metric => metric.id.indexOf('Transactions\\') > -1
      )
    )
  );

  liquidity$: Observable<Metric[]> = this.metrics$.pipe(
    map(metrics =>
      Object.values(metrics).filter(
        metric => metric.id.indexOf('Liquidity\\') > -1
      )
    )
  );

  rewards$: Observable<Metric[]> = this.metrics$.pipe(
    map(metrics =>
      Object.values(metrics).filter(
        metric => metric.id.indexOf('Rewards\\') > -1
      )
    )
  );

  constructor(private api: ApiService) {}
}
