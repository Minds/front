import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map, shareReplay, switchMapTo, tap } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Client } from '../../../services/api';
import * as moment from 'moment';

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
    endTs: this.getUtcUnix(),
  };

  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  metrics$: BehaviorSubject<Metric[]> = new BehaviorSubject([]);

  supply$: Observable<Metric[]> = this.metrics$.pipe(
    map((metrics) =>
      Object.values(metrics).filter(
        (metric) => metric.id.indexOf('Supply\\') > -1
      )
    )
  );

  transactions$: Observable<Metric[]> = this.metrics$.pipe(
    map((metrics) =>
      Object.values(metrics).filter(
        (metric) => metric.id.indexOf('Transactions\\') > -1
      )
    )
  );

  liquidity$: Observable<Metric[]> = this.metrics$.pipe(
    map((metrics) =>
      Object.values(metrics).filter(
        (metric) => metric.id.indexOf('Liquidity\\') > -1
      )
    )
  );

  rewards$: Observable<Metric[]> = this.metrics$.pipe(
    map((metrics) =>
      Object.values(metrics).filter(
        (metric) => metric.id.indexOf('Rewards\\') > -1
      )
    )
  );

  constructor(
    private client: Client,
    protected toasterService: ToasterService
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

  /**
   * For a given input ISO 8601 date string, return the unix timestamp
   * of the end of the day of the selected DAY of the input
   * OR, if it's today, return current unix timestamp
   */
  getUtcUnix(localDate?: string): number {
    const localMoment = localDate ? moment(localDate) : moment();
    const day = localMoment.format('DD');
    const month = localMoment.format('MM');
    const year = localMoment.format('YYYY');

    const now = Math.floor(new Date().getTime() / 1000);

    // ISO 8601 format
    const endOfDate = Math.floor(
      moment(`${year}${month}${day}T235959Z`).utc().valueOf() / 1000
    );

    return Math.min(now, endOfDate);
  }
}
