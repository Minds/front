import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { WalletDashboardService } from './../dashboard.service';
import * as BN from 'bn.js';

@Component({
  selector: 'm-walletBalance--tokens',
  templateUrl: './balance-tokens.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceTokensV2Component implements OnInit, OnDestroy {
  @Input() wallet;
  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected walletService: WalletDashboardService
  ) {}
  tokenBalance;
  offchainBalance;
  onchainBalance;
  inProgress = true;
  protected updateTimer$;
  nextPayout;
  estimatedTokenPayout;

  ngOnInit() {
    this.tokenBalance = this.formatBalance(this.wallet.tokens.balance);
    this.offchainBalance = this.formatBalance(this.wallet.offchain.balance);
    this.onchainBalance = this.formatBalance(this.wallet.onchain.balance);

    const payouts: any = this.walletService.getTokenPayoutOverview();
    console.log('888', payouts);
    this.nextPayout = payouts.nextPayout;
    this.estimatedTokenPayout = payouts.currentReward;

    this.inProgress = false;
    this.updateTimer$ = setInterval(this.updateNextPayout.bind(this), 1000);
    this.detectChanges();
  }
  ngOnDestroy() {
    clearInterval(this.updateTimer$);
  }

  updateNextPayout() {
    if (this.nextPayout) {
      this.nextPayout--;
      this.detectChanges();
    }
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

    if (balance.length > 18) {
      formattedBalance.int = balance.slice(0, -18);
    }
    const decimals = balance.slice(-18);

    console.log('888iszero?', !new BN(decimals).isZero());
    if (!new BN(decimals).isZero() || decimals.slice(0, 3) !== '000') {
      formattedBalance.frac = decimals;
    }
    console.log('888', formattedBalance);
    return formattedBalance;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
