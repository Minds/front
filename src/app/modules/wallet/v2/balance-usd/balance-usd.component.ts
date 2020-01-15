import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { WalletDashboardService } from './../dashboard.service';
import * as moment from 'moment';
@Component({
  selector: 'm-walletBalance--usd',
  templateUrl: './balance-usd.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceUsdV2Component implements OnInit {
  inProgress: boolean = true;
  stripeAccount;
  accountSetup: boolean = true;
  pendingBalance;
  totalPaidOut;
  nextPayoutDate = '';

  @Output() scrollToUsdSettings: EventEmitter<any> = new EventEmitter();
  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected walletService: WalletDashboardService
  ) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.nextPayoutDate = moment()
      .endOf('month')
      .format('ddd Do MMM');

    this.stripeAccount = await this.walletService.getStripeAccount();

    // this.walletService.getStripeAccount().then(response => {
    //   this.stripeAccount = response;
    // });
    console.log(this.stripeAccount);
    if (!this.stripeAccount || !this.stripeAccount.accountNumber) {
      this.accountSetup = false;
      this.pendingBalance = this.formatBalance(0);
      this.totalPaidOut = this.formatBalance(0);
    } else {
      this.pendingBalance = this.formatBalance(
        this.stripeAccount.pendingBalance.amount / 100
      );

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

    const frac = splitBalance[1].toString();
    formattedBalance.frac = frac.length < 2 ? frac.concat('0') : frac;
    return formattedBalance;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
