import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Subscription } from 'rxjs';
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
  showModal = false;
  protected updateTimer$;

  nextPayout;
  estimatedTokenPayout;
  payoutSubscription: Subscription;

  ngOnInit() {
    this.tokenBalance = this.formatBalance(this.wallet.tokens.balance);
    this.offchainBalance = this.formatBalance(this.wallet.offchain.balance);
    this.onchainBalance = this.formatBalance(this.wallet.onchain.balance);

    this.getPayout();

    this.inProgress = false;
    this.updateTimer$ = setInterval(this.updateNextPayout.bind(this), 1000);
    this.detectChanges();
  }
  ngOnDestroy() {
    clearInterval(this.updateTimer$);
    if (this.payoutSubscription) {
      this.payoutSubscription.unsubscribe();
    }
  }

  async getPayout() {
    try {
      const result: any = await this.client.get(
        `api/v2/blockchain/contributions/overview`
      );
      this.nextPayout = result.nextPayout;
      this.estimatedTokenPayout = result.currentReward;
      this.detectChanges();
    } catch (e) {
      console.error(e);
    }
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
    const frac = balance.slice(-18);

    if (!new BN(frac).isZero() || frac.slice(0, 3) !== '000') {
      formattedBalance.frac = frac;
    }
    return formattedBalance;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
