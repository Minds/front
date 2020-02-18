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
import {
  WalletDashboardService,
  WalletCurrency,
  SplitBalance,
} from '../dashboard.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
@Component({
  selector: 'm-walletBalance--cash',
  templateUrl: './balance-cash.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceCashComponent implements OnInit {
  @Output() scrollToCashSettings: EventEmitter<any> = new EventEmitter();
  @Input() viewId: string;
  @Input() cashWallet: WalletCurrency;

  // TODOOJM
  // private _cashWallet: WalletCurrency;
  // @Input() set cashWallet(value: WalletCurrency) {
  //   this._cashWallet = value;
  // }
  // get wallet(): WalletCurrency {
  //   return this._cashWallet;
  // }

  // account;
  hasAccount: boolean = false;
  hasBank: boolean = false;
  pendingBalance: SplitBalance;
  totalPaidOut: SplitBalance;
  proEarnings: SplitBalance;
  nextPayoutDate = '';
  // onSettingsTab: boolean = false;
  currency = 'usd';
  // paramsSubscription: Subscription;
  init: boolean = false;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected walletService: WalletDashboardService,
    // protected route: ActivatedRoute,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    // this.paramsSubscription = this.route.paramMap.subscribe(
    //   (params: ParamMap) => {
    //     this.onSettingsTab = params.get('view') === 'settings';
    //     this.detectChanges();
    //   }
    // );

    // this.load();

    // TODOOJM confirm that Mark has migrated all stripe accts to monthly intervals
    // TODOOJM OR just get the payout date from the stripe account itself
    this.nextPayoutDate = moment()
      .endOf('month')
      .format('ddd Do MMM');

    this.hasAccount = this.cashWallet.stripeDetails.hasAccount;
    this.hasBank = this.cashWallet.stripeDetails.hasBank;
    this.pendingBalance = this.cashWallet.stripeDetails.pendingBalanceSplit;
    this.totalPaidOut = this.cashWallet.stripeDetails.totalPaidOutSplit;

    this.currency = this.hasBank ? this.cashWallet.label : 'USD';

    if (this.configs.get('pro')) {
      this.getProEarnings();
    }
    this.init = true;
    this.detectChanges();
  }

  // ngOnDestroy() {
  //   if (this.paramsSubscription) {
  //     this.paramsSubscription.unsubscribe();
  //   }
  // }

  // async load() {
  // // TODOOJM confirm that Mark has migrated all stripe accts to monthly intervals
  // // TODOOJM OR just get the payout date from the stripe account itself
  // this.nextPayoutDate = moment()
  //   .endOf('month')
  //   .format('ddd Do MMM');

  // this.account = await this.walletService.getStripeAccount();
  // if (!this.account || !this.account.accountNumber) {
  // if (this.cashWallet.address !== 'stripe') {
  //   // this.hasAccount = false;
  // this.pendingBalance = this.walletService.splitBalance(0);
  // this.totalPaidOut = this.walletService.splitBalance(0);
  // } else {
  // this.hasAccount = true;
  // this.pendingBalance = this.walletService.splitBalance(
  //   this.cashWallet.balance
  // );
  // this.currency = this.cashWallet.label.toUpperCase();
  // this.account = await this.walletService.getStripeAccount();
  // this.pendingBalance = this.walletService.splitBalance(
  //   this.account.pendingBalance.amount / 100
  // );
  // if (this.account.bankAccount) {
  //   this.currency = this.account.bankAccount.currency.toUpperCase();
  // }
  // let totalPaidOutRaw =
  //   (this.account.totalBalance.amount -
  //     this.account.pendingBalance.amount) /
  //   100;
  // this.totalPaidOut = this.walletService.splitBalance(totalPaidOutRaw);
  // }

  // this.detectChanges();
  // }

  async getProEarnings() {
    try {
      const response: number = await this.walletService.getProEarnings();
      this.proEarnings = this.walletService.splitBalance(response);
    } catch (e) {
      console.error(e.message);
      this.proEarnings = this.walletService.splitBalance(0);
    }
    this.detectChanges();
  }

  // formatBalance(balance) {
  //   console.log(balance);
  //   const formattedBalance = {
  //     total: balance,
  //     int: 0,
  //     frac: null,
  //   };
  //   if (balance <= 0) {
  //     return formattedBalance;
  //   }
  //   const splitBalance = balance.toString().split('.');
  //   console.log('888 splitBal...', splitBalance);

  //   formattedBalance.int = splitBalance[0];
  //   console.log('888 int...', formattedBalance);

  //   if (splitBalance[1]) {
  //     const frac = splitBalance[1].toString();
  //     formattedBalance.frac = frac.length < 2 ? frac.concat('0') : frac;
  //     console.log('888 frac...', formattedBalance);
  //   }
  //   return formattedBalance;
  // }

  scrollToSettings() {
    this.scrollToCashSettings.emit();
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
