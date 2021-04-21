import { ChangeDetectorRef, Component } from '@angular/core';
import { Client } from '../../../../../services/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Filter, Option } from '../../../../../interfaces/dashboard';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../../../../services/session';

const SUM_AMOUNT = (arr, currencyType): number => {
  return arr.reduce((acc, item) => {
    const amount =
      currencyType === 'usd' ? item.amount_usd : item.amount_tokens;
    return acc + amount;
  }, 0);
};

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

  isPro: boolean;
  pro_method: 'usd' | 'tokens';
  isPlus: boolean;
  plus_method: 'usd' | 'tokens';

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private session: Session
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
    const user = this.session.getLoggedInUser();
    this.isPlus = user.plus;
    this.plus_method = user.plus_method;
    this.isPro = user.pro;
    this.pro_method = user.pro_method;
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

  shouldShowUpgradePrompt(earningsGroupId) {
    return earningsGroupId === 'partner' && !this.isPro; //we don't ask for plus since if user is pro, it already includes plus, and if it is only plus, we show the prompt anyway
  }

  shouldHide(earningsGroupId) {
    if (earningsGroupId !== 'partner') {
      return false;
    }

    if (
      this.currencyType === 'usd' &&
      ((this.isPro && this.pro_method === 'tokens') ||
        (this.isPlus && this.plus_method === 'tokens'))
    ) {
      return true;
    }

    if (
      this.currencyType === 'tokens' &&
      ((this.isPro && this.pro_method === 'usd') ||
        (this.isPlus && this.plus_method === 'usd'))
    ) {
      return true;
    }
  }
}
