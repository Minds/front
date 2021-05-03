import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  WalletV2Service,
  Wallet,
} from '../../../../modules/wallet/components/wallet-v2.service';
import { Subscription } from 'rxjs';
import { TokenPricesService } from '../../../../modules/wallet/components/components/currency-value/token-prices.service';

@Component({
  selector: 'm-topbar-walletBalance',
  templateUrl: './topbar-wallet-balance.html',
  styleUrls: ['./topbar-wallet-balance.component.ng.scss'],
})
export class TopbarWalletBalance {
  wallet: Wallet;
  usdBalance: number;
  tokenBalance: any;
  tokenPrice: number;

  protected walletBalance: Subscription;
  protected tokenValue: Subscription;

  constructor(
    private walletService: WalletV2Service,
    private tokenPricesService: TokenPricesService,
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

  navigateWallet() {
    this.router.navigate(['/wallet/tokens/rewards']);
  }

  ngOnDestroy() {
    this.tokenValue.unsubscribe();
    this.walletBalance.unsubscribe();
  }
}
