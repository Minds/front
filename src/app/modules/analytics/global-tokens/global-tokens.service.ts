import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map, shareReplay, switchMapTo, tap } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { Client } from '../../../services/api';

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
  params: any = {
    endTs: Math.floor(Date.now() / 1000),
  };

  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  metrics$: BehaviorSubject<Metric[]> = new BehaviorSubject([]);

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

  constructor(
    private client: Client,
    protected toasterService: FormToastService
  ) {}

  /**
   * Sets parameters to be used.
   * @param { Object } params - parameters to be used.
   */
  setParams(params): AnalyticsGlobalTokensService {
    this.params = params;
    return this;
  }

  async fetch(): Promise<any> {
    console.log('ojm fetch', this.params);
    this.inProgress$.next(true);

    try {
      const response: any = await this.client.get(
        'api/v3/blockchain/metrics',
        this.params
      );

      if (response && response.metrics) {
        this.metrics$.next(response.metrics);
      }
    } catch (e) {
      console.error(e);
      this.toasterService.error(
        (e && e.message) || 'There was a problem loading this content.'
      );
    } finally {
      this.inProgress$.next(false);
    }
  }
}
