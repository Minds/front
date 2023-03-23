import { ChangeDetectorRef, Component } from '@angular/core';
import { Client } from '../../../../../services/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Filter, Option } from '../../../../../interfaces/dashboard';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

const SUM_AMOUNT = (arr, currencyType): number => {
  return arr.reduce((acc, item) => {
    const amount =
      currencyType === 'usd' ? item.amount_usd : item.amount_tokens;
    return acc + amount;
  }, 0);
};

/**
 * Wallet dashboard view of a selected month's earnings with totals and subtotals.
 * Used for both tokens wallet and cash wallet.
 */
@Component({
  selector: 'm-wallet__earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['../accordion/accordion.component.ng.scss'],
})
export class WalletEarningsComponent {
  earnings$: BehaviorSubject<any> = new BehaviorSubject(null);
  earningsTotal$: Observable<number> = this.earnings$.pipe(
    map(earnings => SUM_AMOUNT(earnings ?? [], this.currencyType))
  );
  payouts$: BehaviorSubject<any> = new BehaviorSubject(null);
  payoutsTotal$: Observable<number> = this.payouts$.pipe(
    map(payouts => SUM_AMOUNT(payouts ?? [], this.currencyType))
  );
  inProgress = false;
  from: number = moment()
    .utc()
    .startOf('month')
    .unix();

  filter: Filter = {
    id: 'month',
    label: '',
    options: [],
  };

  currencyType: 'usd' | 'tokens';
  expandedRow: string;

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.filter.options = this.buildMonthOptions(6);
  }

  /**
   * Builds the options for the filters
   * @param numberOfMonths
   */
  private buildMonthOptions(numberOfMonths: number = 6): Option[] {
    const months = [];
    const dateStart = moment()
      .utc()
      .subtract(numberOfMonths, 'month');
    const dateEnd = moment()
      .utc()
      .startOf('month');
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
    this.currencyType =
      this.route?.snapshot?.parent?.url[0]?.path === 'tokens'
        ? 'tokens'
        : 'usd';
    this.loadTransactions();
  }

  async loadTransactions(): Promise<void> {
    this.inProgress = true;

    try {
      const response = <any>await this.client.get(
        'api/v3/monetization/earnings/overview',
        {
          from: this.from,
          to: moment
            .unix(this.from)
            .utc()
            .add(1, 'month')
            .unix(),
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
      this.detectChanges();
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
      case 'boost_partner':
        return 'Boost Partners';
    }

    return id;
  }

  reset(): void {
    this.earnings$.next(null);
    this.payouts$.next(null);
  }

  filterSelected(e): void {
    const option: Option = e.option;
    this.from = parseInt(option.id);

    this.reset();
    this.loadTransactions();
  }

  /**
   * Toggle the expanded row
   */
  toggleRow(rowId: string): void {
    if (this.expandedRow === rowId) {
      this.expandedRow = null;
      return;
    }
    this.expandedRow = rowId;
  }

  /**
   * Runs change detection
   */
  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
