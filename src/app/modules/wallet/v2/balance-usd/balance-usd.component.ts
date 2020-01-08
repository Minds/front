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
    // Get next payout date
    const firstDayNextMonth = new Date();
    console.log(firstDayNextMonth);
    // const firstDayNextMonth = new Date(2008, 11 + 1, 1);
    // this.nextPayoutDate = new Date(firstDayNextMonth - 1);

    // Get stripe account
    this.stripeAccount = this.walletService.getStripeAccount();
    if (!this.stripeAccount) {
      this.pendingBalance = this.formatBalance(0);
      this.totalPaidOut = this.formatBalance(0);
    } else {
      // get pending balance + format it
      this.pendingBalance = this.formatBalance(
        this.stripeAccount.pendingBalance.amount
      );

      // get paid out + format it
      this.totalPaidOut = this.formatBalance(
        this.stripeAccount.totalBalance - this.stripeAccount.pendingBalance
      );
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
