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
  tokenBalance;
  offchainBalance;
  onchainBalance;
  inProgress = true;
  showModal = false;
  protected updateTimer$;

  nextPayoutDate = 0;
  estimatedTokenPayout;
  payoutSubscription: Subscription;
  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected walletService: WalletDashboardService
  ) {}

  ngOnInit() {
    this.tokenBalance = this.formatBalance(this.wallet.tokens.balance);
    this.offchainBalance = this.formatBalance(this.wallet.offchain.balance);
    this.onchainBalance = this.formatBalance(this.wallet.onchain.balance);
    this.getPayout();

    this.inProgress = false;
    this.updateTimer$ = setInterval(this.updateNextPayoutDate.bind(this), 1000);
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
      this.nextPayoutDate = result.nextPayout;
      this.estimatedTokenPayout = result.currentReward;
      this.detectChanges();
    } catch (e) {
      console.error(e);
    }
  }

  updateNextPayoutDate() {
    if (this.nextPayoutDate) {
      this.nextPayoutDate--;
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
