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
import { ConfigsService } from '../../../../common/services/configs.service';
@Component({
  selector: 'm-walletBalance--cash',
  templateUrl: './balance-cash.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceCashComponent implements OnInit, OnDestroy {
  inProgress: boolean = true;
  account;
  hasAccount: boolean = true;
  isPro: boolean = false;
  pendingBalance;
  totalPaidOut;
  nextPayoutDate = '';
  proEarnings;
  onSettingsTab: boolean = false;
  currency = 'usd';
  paramsSubscription: Subscription;
  loaded: boolean = false;

  @Output() scrollToCashSettings: EventEmitter<any> = new EventEmitter();
  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected walletService: WalletDashboardService,
    protected route: ActivatedRoute,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.onSettingsTab = params.get('view') === 'settings';
        this.detectChanges();
      }
    );
    // TOOOJM toggle
    this.isPro = true;
    // this.isPro = this.configs.get('pro');

    this.load();
    this.getProEarnings();
    // this.loaded = true;
    this.detectChanges();
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  async load() {
    // TODOOJM confirm that mark has migrated all stripe accts to monthly intervals
    this.nextPayoutDate = moment()
      .endOf('month')
      .format('ddd Do MMM');

    this.account = await this.walletService.getStripeAccount();

    if (!this.account || !this.account.accountNumber) {
      this.hasAccount = false;
      this.pendingBalance = this.formatBalance(0);
      this.totalPaidOut = this.formatBalance(0);
    } else {
      this.pendingBalance = this.formatBalance(
        this.account.pendingBalance.amount / 100
      );
      if (this.account.bankAccount) {
        this.currency = this.account.bankAccount.currency.toUpperCase();
      }

      let totalPaidOutRaw =
        (this.account.totalBalance.amount -
          this.account.pendingBalance.amount) /
        100;

      if (totalPaidOutRaw < 0) {
        totalPaidOutRaw = 0;
      }

      this.totalPaidOut = this.formatBalance(totalPaidOutRaw);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  async getProEarnings() {
    this.inProgress = true;
    this.detectChanges();

    // try {
    //   const response: number = await this.walletService.getProEarnings();
    //   this.proEarnings = this.formatBalance(response);
    // } catch (e) {
    //   console.error(e.message);
    //   this.proEarnings = this.formatBalance(0);
    // }
    this.proEarnings = this.formatBalance(123.4);
    this.inProgress = false;
    this.loaded = true;
    this.detectChanges();
  }

  formatBalance(balance) {
    console.log(balance);
    const formattedBalance = {
      total: balance,
      int: 0,
      frac: null,
    };
    if (balance <= 0) {
      return formattedBalance;
    }
    const splitBalance = balance.toString().split('.');
    console.log('888 splitBal...', splitBalance);

    formattedBalance.int = splitBalance[0];
    console.log('888 int...', formattedBalance);

    if (splitBalance[1]) {
      const frac = splitBalance[1].toString();
      formattedBalance.frac = frac.length < 2 ? frac.concat('0') : frac;
      console.log('888 frac...', formattedBalance);
    }
    return formattedBalance;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
