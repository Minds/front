import { Component } from '@angular/core';
import { Client } from '../../../../../services/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Filter, Option } from '../../../../../interfaces/dashboard';
import * as moment from 'moment';

const SUM_CENTS = (arr): number => {
  return arr.reduce((acc, item) => {
    return acc + item.amount_cents;
  }, 0);
};

/**
 * Container for a wallet earnings table where the earned currency is cash
 */
@Component({
  selector: 'm-walletProEarnings--cash',
  templateUrl: './pro-earnings.component.html',
})
export class WalletProEarningsCashComponent {
  earnings$: BehaviorSubject<any> = new BehaviorSubject(null);
  earningsTotal$: Observable<number> = this.earnings$.pipe(
    map((earnings) => SUM_CENTS(earnings))
  );
  payouts$: BehaviorSubject<any> = new BehaviorSubject(null);
  payoutsTotal$: Observable<number> = this.payouts$.pipe(
    map((payouts) => SUM_CENTS(payouts))
  );
  inProgress = false;
  from: number = moment().utc().startOf('month').unix();

  filter: Filter = {
    id: 'month',
    label: '',
    options: [],
  };

  constructor(private client: Client) {
    this.filter.options = this.buildMonthOptions(6);
  }

  /**
   * Builds the options for the filters
   * @param numberOfMonths
   */
  private buildMonthOptions(numberOfMonths: number = 6): Option[] {
    const months = [];
    const dateStart = moment().utc().subtract(numberOfMonths, 'month');
    const dateEnd = moment().utc().startOf('month');
    while (dateEnd.diff(dateStart, 'months') >= 0) {
      months.push({
        id: dateEnd.unix(),
        label: dateEnd.format('MMMM YYYY'),
      });
      dateEnd.subtract(1, 'month');
    }
    return months;
  }

  ngOnInit() {
    this.loadTransactions();
  }

  async loadTransactions(): Promise<void> {
    this.inProgress = true;

    try {
      const response = <any>await this.client.get(
        'api/v3/monetization/earnings/overview',
        {
          from: this.from,
          to: moment.unix(this.from).utc().add(1, 'month').unix(),
        }
      );
      if (response.earnings) {
        this.earnings$.next(response.earnings);
      }

      if (response.payouts) {
        this.payouts$.next(response.payouts);
      }
    } catch (e) {
    } finally {
      this.inProgress = false;
    }
  }

  getFriendlyLabel(id: string): string {
    switch (id) {
      case 'wire':
        return 'Minds Pay';
      case 'wire-all':
        return 'Memberships & Tips';
      case 'partner':
        return 'Revenue Share';
      case 'plus':
        return 'Minds+ Content';
      case 'wire_referral':
        return 'Minds Pay Commissions';
    }

    return id;
  }

  reset(): void {
    this.earnings$.next(null);
    this.payouts$.next(null);
  }
}
