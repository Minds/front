import { Component } from '@angular/core';
import {
  WalletV2Service,
  Wallet,
} from '../../../../modules/wallet/components/wallet-v2.service';
import { Subscription } from 'rxjs';
import { ConnectWalletModalService } from '../../../../modules/blockchain/connect-wallet/connect-wallet-modal.service';
import { SettingsV2WalletService } from '../../../../modules/settings-v2/other/wallet/wallet.service';
import { CommonModule } from '~/common/common.module';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'm-topbar__walletBalance',
  templateUrl: './topbar-wallet-balance.html',
  styleUrls: ['./topbar-wallet-balance.component.ng.scss'],
  imports: [CommonModule, NgIf, RouterLink],
})
export class TopbarWalletBalance {
  wallet: Wallet;
  tokenBalance: any;

  /**
   * Snapshot of isConnected observable
   */
  isConnected: boolean;

  protected walletBalance: Subscription;
  protected connectedWallet: Subscription;

  constructor(
    private walletService: WalletV2Service,
    protected connectWalletModalService: ConnectWalletModalService,
    private walletPrivacySettings: SettingsV2WalletService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.walletService.loadWallet();

    this.walletBalance = this.walletService.wallet$.subscribe(
      (wallet: Wallet) => {
        this.tokenBalance = wallet.tokens.balance;
      }
    );

    this.connectedWallet =
      this.connectWalletModalService.isConnected$.subscribe(
        (isConnected) => (this.isConnected = isConnected)
      );
  }

  formatTokens(value: number) {
    if (value === 0) {
      return 0;
    } else if (value < 1000) {
      return value.toFixed(1);
    } else return `${(value / 1000).toFixed(1)}k`;
  }

  /**
   * True if wallet balance should be shown.
   * @returns { boolean } true if balance should be shown.
   */
  public showWalletBalance(): boolean {
    return (
      this.isConnected &&
      this.tokenBalance >= 0 &&
      !this.walletPrivacySettings.shouldHideWalletBalance()
    );
  }

  ngOnDestroy() {
    this.walletBalance.unsubscribe();
    this.connectedWallet.unsubscribe();
  }
}
