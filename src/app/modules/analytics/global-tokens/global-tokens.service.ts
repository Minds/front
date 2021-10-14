import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map, shareReplay, switchMapTo, tap } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';
import { FormToastService } from '../../../common/services/form-toast.service';
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
    endTs: this.getUtcUnix(new Date()),
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
   */
  getUtcUnix(localDate: Date): number {
    const localMoment = moment(new Date(localDate));
    const day = localMoment.format('D');
    const month = localMoment.format('MMM');
    const year = localMoment.format('YYYY');

    return Math.floor(
      moment(`${day} ${month} ${year} 23:59:59 GMT+0000`)
        .utc()
        .valueOf() / 1000
    );
  }
}
