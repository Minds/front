import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import {
  WalletV2Service,
  Wallet,
  WalletCurrency,
  SplitBalance,
} from '../../wallet-v2.service';
import * as moment from 'moment';
import { ProService } from '../../../../pro/pro.service';
@Component({
  selector: 'm-walletBalance--cash',
  templateUrl: './balance-cash.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceCashComponent implements OnInit {
  cashWallet: WalletCurrency;
  cashWalletSubscription: Subscription;

  hasAccount: boolean = false;
  hasBank: boolean = false;
  pendingBalance: SplitBalance;
  totalPaidOut: SplitBalance;
  proEarnings: SplitBalance;
  isPro: boolean = false;
  nextPayoutDate = '';
  currency = 'usd';
  init: boolean = false;

  childRouteSubscription: Subscription;
  childRoutePath: string;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected walletService: WalletV2Service,
    private route: ActivatedRoute,
    protected proService: ProService
  ) {}

  ngOnInit() {
    this.cashWalletSubscription = this.walletService.wallet$
      .pipe(map((wallet: Wallet) => wallet.cash))
      .subscribe((cashWallet: WalletCurrency) => {
        this.cashWallet = cashWallet;
        this.load();
      });

    this.childRouteSubscription = this.route.firstChild.url.subscribe(
      (url: UrlSegment[]) => {
        this.childRoutePath = url[0].path;
        this.detectChanges();
      }
    );

    this.getPro();
  }

  ngOnDestroy() {
    this.childRouteSubscription.unsubscribe();
    this.cashWalletSubscription.unsubscribe();
  }

  load(): void {
    if (!this.cashWallet || !this.cashWallet.stripeDetails) return;
    this.hasAccount = this.cashWallet.stripeDetails.hasAccount;
    this.hasBank = this.cashWallet.stripeDetails.hasBank;
    this.pendingBalance = this.cashWallet.stripeDetails.pendingBalanceSplit;
    this.totalPaidOut = this.cashWallet.stripeDetails.totalPaidOutSplit;
    this.currency = this.hasBank ? this.cashWallet.label : 'USD';

    const payoutInterval = this.walletService.stripeDetails.payoutInterval;

    if (payoutInterval === 'daily') {
      this.nextPayoutDate = moment()
        .add(1, 'days')
        .format('ddd Do MMM');
    } else {
      this.nextPayoutDate = moment()
        .endOf('month')
        .format('ddd Do MMM');
    }

    this.init = true;
    this.detectChanges();
  }
  async getPro(): Promise<void> {
    try {
      this.isPro = await this.proService.isActive();
      if (this.isPro) {
        this.getProEarnings();
      }
    } catch (e) {
      console.error(e && e.message);
    }
    this.detectChanges();
  }

  async getProEarnings(): Promise<void> {
    try {
      const response: number = await this.walletService.getProEarnings();
      this.proEarnings = this.walletService.splitBalance(response);
    } catch (e) {
      console.error(e.message);
      this.proEarnings = this.walletService.splitBalance(0);
    }
    this.detectChanges();
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
