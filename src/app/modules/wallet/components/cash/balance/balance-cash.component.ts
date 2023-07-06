import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { PlusService } from '../../../../plus/plus.service';
import { CashWalletService } from '../cash.service';

/**
 * Balances of earnings, total transfers and pending transfers in the cash section of the wallet.
 *
 * Also contains onboarding notice if user hasn't set up bank account yet
 */
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
  totalPaidOut: SplitBalance;
  proEarnings: SplitBalance;
  isPlus: boolean = false;
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
    protected plusService: PlusService,
    protected cashService: CashWalletService
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

    this.getPlus();
  }

  ngOnDestroy() {
    this.childRouteSubscription.unsubscribe();
    this.cashWalletSubscription.unsubscribe();
  }

  load(): void {
    if (!this.cashWallet || !this.cashWallet.stripeDetails) return;
    this.hasAccount = this.cashWallet.stripeDetails.hasAccount;
    this.hasBank = this.cashWallet.stripeDetails.hasBank;
    this.totalPaidOut = this.cashWallet.stripeDetails.totalPaidOutSplit;
    this.currency = this.hasBank ? this.cashWallet.label : 'USD';

    this.init = true;
    this.detectChanges();
  }

  async getPlus(): Promise<void> {
    try {
      this.isPlus = await this.plusService.isActive();
      if (this.isPlus) {
        this.getPlusEarnings();
      }
    } catch (e) {
      console.error(e && e.message);
    }
    this.detectChanges();
  }

  async getPlusEarnings(): Promise<void> {
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
