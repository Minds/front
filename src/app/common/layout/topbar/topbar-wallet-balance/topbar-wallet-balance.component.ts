import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  WalletV2Service,
  Wallet,
} from '../../../../modules/wallet/components/wallet-v2.service';
import { Subscription } from 'rxjs';
import { TokenPricesService } from '../../../../modules/wallet/components/components/currency-value/token-prices.service';
import { ConnectWalletModalService } from '../../../../modules/blockchain/connect-wallet/connect-wallet-modal.service';
import { SettingsV2WalletService } from '../../../../modules/settings-v2/other/wallet/wallet.service';

@Component({
  selector: 'm-topbar__walletBalance',
  templateUrl: './topbar-wallet-balance.html',
  styleUrls: ['./topbar-wallet-balance.component.ng.scss'],
})
export class TopbarWalletBalance {
  wallet: Wallet;
  usdBalance: number;
  tokenBalance: any;
  tokenPrice: number;

  /**
   * Snapshot of isConnected observable
   */
  isConnected: boolean;

  protected walletBalance: Subscription;
  protected tokenValue: Subscription;
  protected connectedWallet: Subscription;

  constructor(
    private walletService: WalletV2Service,
    private tokenPricesService: TokenPricesService,
    protected connectWalletModalService: ConnectWalletModalService,
    private walletPrivacySettings: SettingsV2WalletService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.walletService.loadWallet();

    this.tokenValue = this.tokenPricesService.minds$.subscribe(price => {
      this.tokenPrice = price;
      this.calculateUSD();
    });

    this.walletBalance = this.walletService.wallet$.subscribe(
      (wallet: Wallet) => {
        this.tokenBalance = wallet.tokens.balance;
        this.calculateUSD();
      }
    );

    this.connectedWallet = this.connectWalletModalService.isConnected$.subscribe(
      isConnected => (this.isConnected = isConnected)
    );
  }

  calculateUSD() {
    this.usdBalance = this.tokenBalance * this.tokenPrice;
  }

  formatTokens(value: number) {
    if (value === 0) {
      return 0;
    } else if (value < 1000) {
      return value.toFixed(1);
    } else return `${(value / 1000).toFixed(1)}k`;
  }

  formatUSD(value: number) {
    if (value === 0) {
      return 0;
    } else if (value < 1000) {
      return value.toFixed(2);
    } else {
      return `${(value / 1000).toFixed(1)}k`;
    }
  }

  /**
   * Connect wallet
   * @param e
   */
  async connectWallet(e: MouseEvent): Promise<void> {
    const onComplete = () => (this.isConnected = undefined);
    await this.connectWalletModalService.joinRewards(onComplete);
  }

  /**
   * True if wallet balance should be shown.
   * @returns { boolean } true if balance should be shown.
   */
  public showWalletBalance(): boolean {
    return (
      this.isConnected &&
      this.tokenBalance >= 0 &&
      this.usdBalance >= 0 &&
      !this.walletPrivacySettings.shouldHideWalletBalance()
    );
  }

  ngOnDestroy() {
    this.tokenValue.unsubscribe();
    this.walletBalance.unsubscribe();
    this.connectedWallet.unsubscribe();
  }
}
