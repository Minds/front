import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import {
  WalletV2Service,
  WalletCurrency,
  SplitBalance,
} from '../../wallet-v2.service';
import * as moment from 'moment';
import { ConfigsService } from '../../../../../common/services/configs.service';
@Component({
  selector: 'm-walletBalance--cash',
  templateUrl: './balance-cash.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceCashComponent implements OnInit {
  cashWallet: WalletCurrency;

  hasAccount: boolean = false;
  hasBank: boolean = false;
  pendingBalance: SplitBalance;
  totalPaidOut: SplitBalance;
  proEarnings: SplitBalance;
  nextPayoutDate = '';
  currency = 'usd';
  init: boolean = false;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected walletService: WalletV2Service,
    private configs: ConfigsService
  ) {
    this.cashWallet = this.walletService.wallet.cash;
  }

  ngOnInit() {
    this.load();

    this.nextPayoutDate = moment()
      .endOf('month')
      .format('ddd Do MMM');

    if (this.configs.get('pro')) {
      this.getProEarnings();
    }

    this.init = true;
    this.detectChanges();
  }

  load(): void {
    if (!this.cashWallet || !this.cashWallet.stripeDetails) return;
    this.hasAccount = this.cashWallet.stripeDetails.hasAccount;
    this.hasBank = this.cashWallet.stripeDetails.hasBank;
    this.pendingBalance = this.cashWallet.stripeDetails.pendingBalanceSplit;
    this.totalPaidOut = this.cashWallet.stripeDetails.totalPaidOutSplit;
    this.currency = this.hasBank ? this.cashWallet.label : 'USD';
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
