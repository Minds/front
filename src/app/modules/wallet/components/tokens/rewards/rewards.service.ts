import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';
import * as moment from 'moment';

export type ContributionMetric = {
  id: string;
  label: string;
  amount: string;
  score: number;
};

@Injectable()
export class WalletTokenRewardsService {
  /**
   * Date in unix seconds observable
   */
  dateTs$: BehaviorSubject<number> = new BehaviorSubject(
    this.getStartOfDayUnixTs(new Date())
  );

  /**
   * Contribution score for relative date
   */
  contributionScores$: Observable<ContributionMetric[]> = this.dateTs$.pipe(
    switchMap(dateTs => {
      return this.api
        .get('api/v2/blockchain/contributions', {
          from: dateTs,
          to: dateTs + 1,
        })
        .pipe(
          map(response => {
            const metrics: ContributionMetric[] = [];
            if (response.contributions.length > 0) {
              Object.keys(response.contributions[0]?.metrics).forEach(key => {
                const metric = response.contributions[0].metrics[key];
                metric.id = key;
                metric.label = metric.metric; // MH: being lazy here - reward-popup.component.ts has the label breakdown
                metrics.push(metric);
              });
            }
            return metrics;
          })
        );
    })
  );

  /**
   * Liquidity positions relative to date
   */
  liquidityPositions$: Observable<any> = this.dateTs$.pipe(
    switchMap(dateTs => {
      return this.api.get('api/v3/blockchain/liquidity-positions', {
        timestamp: dateTs,
      });
    })
  );

  /**
   * Rewards for relative date
   */
  rewards$: Observable<any> = this.dateTs$.pipe(
    switchMap(dateTs => {
      const date = moment(dateTs * 1000)
        .utc()
        .startOf('day')
        .format('Y-M-D');
      return this.api.get('api/v3/rewards', { date });
    })
  );

  /**
   * Rewards for yesterday
   */
  yesterdayRewards$: Observable<any> = this.dateTs$.pipe(
    switchMap(dateTs => {
      const date = moment(dateTs * 1000)
        .utc()
        .startOf('day')
        .subtract('1', 'day')
        .format('Y-M-D');
      return this.api.get('api/v3/rewards', { date });
    })
  );

  /**
   * True if user has pending transactions from yesterday in any category.
   */
  hasPending$: Observable<boolean> = this.yesterdayRewards$.pipe(
    map(res =>
      [res.engagement, res.holding, res.liquidity].some(
        entry => !entry.payout_tx
      )
    ),
    catchError(e => {
      console.error(e);
      return EMPTY;
    })
  );

  constructor(private api: ApiService) {}

  /**
   * Set the date
   * @param date
   */
  setDate(date: Date) {
    this.dateTs$.next(this.getStartOfDayUnixTs(date));
  }

  /**
   * Return the unix timestamp for the start of the day
   * @param date
   */
  private getStartOfDayUnixTs(date: Date): number {
    return Number(
      moment(date)
        .utc()
        .startOf('day')
        .format('X')
    );
  }
}
