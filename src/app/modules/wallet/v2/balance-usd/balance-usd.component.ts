import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
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
  @Input() wallet;
  inProgress = true;
  stripeAccount;
  pendingBalance;
  totalPaidOut;
  nextPayoutDate = '';

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected walletService: WalletDashboardService
  ) {}

  ngOnInit() {
    this.nextPayoutDate = moment()
      .endOf('month')
      .format('ddd Do MMM');

    // Get stripe account
    this.walletService.getStripeAccount().then(response => {
      this.stripeAccount = response;
    });
    console.log(this.stripeAccount);
    if (!this.stripeAccount) {
      this.pendingBalance = this.formatBalance(0);
      this.totalPaidOut = this.formatBalance(0);
    } else {
      this.pendingBalance = this.formatBalance(
        this.stripeAccount.pendingBalance.amount
      );

      let totalPaidOutRaw =
        this.stripeAccount.totalBalance - this.stripeAccount.pendingBalance;

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
    formattedBalance.frac = splitBalance[1];
    return formattedBalance;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
