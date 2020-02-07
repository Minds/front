import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { WalletDashboardService } from '../dashboard.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
@Component({
  selector: 'm-walletBalance--cash',
  templateUrl: './balance-cash.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceCashComponent implements OnInit, OnDestroy {
  inProgress: boolean = true;
  stripeAccount;
  hasAccount: boolean = true;
  pendingBalance;
  totalPaidOut;
  nextPayoutDate = '';
  onSettingsTab: boolean = false;
  currency = 'usd';
  paramsSubscription: Subscription;

  @Output() scrollToCashSettings: EventEmitter<any> = new EventEmitter();
  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected walletService: WalletDashboardService,
    protected route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.onSettingsTab = params.get('view') === 'settings';
        this.detectChanges();
      }
    );

    this.load();
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  async load() {
    // TODOOJM $stripe - this is not accurate for all stripe accounts
    this.nextPayoutDate = moment()
      .endOf('month')
      .format('ddd Do MMM');

    this.stripeAccount = await this.walletService.getStripeAccount();

    if (!this.stripeAccount || !this.stripeAccount.accountNumber) {
      this.hasAccount = false;
      this.pendingBalance = this.formatBalance(0);
      this.totalPaidOut = this.formatBalance(0);
    } else {
      this.pendingBalance = this.formatBalance(
        this.stripeAccount.pendingBalance.amount / 100
      );
      if (this.stripeAccount.bankAccount) {
        this.currency = this.stripeAccount.bankAccount.currency.toUpperCase();
      }

      let totalPaidOutRaw =
        (this.stripeAccount.totalBalance.amount -
          this.stripeAccount.pendingBalance.amount) /
        100;

      if (totalPaidOutRaw < 0) {
        totalPaidOutRaw = 0;
      }

      this.totalPaidOut = this.formatBalance(totalPaidOutRaw);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  formatBalance(balance) {
    const formattedBalance = {
      total: balance,
      int: 0,
      frac: null,
    };
    if (balance <= 0) {
      return formattedBalance;
    }
    const splitBalance = balance.toString().split('.');

    formattedBalance.int = splitBalance[0];

    if (splitBalance[1]) {
      const frac = splitBalance[1].toString();
      formattedBalance.frac = frac.length < 2 ? frac.concat('0') : frac;
    }
    return formattedBalance;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
