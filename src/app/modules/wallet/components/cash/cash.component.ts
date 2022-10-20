import { Component, OnDestroy, OnInit } from '@angular/core';
import { Wallet, WalletCurrency, WalletV2Service } from '../wallet-v2.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/**
 * Container for cash section of the wallet
 */
@Component({
  selector: 'm-walletV2__cash',
  templateUrl: './cash.component.html',
})
export class WalletV2CashComponent implements OnInit, OnDestroy {
  public hasAccount: boolean = false;

  private cashWalletSubscription: Subscription;

  constructor(private walletV2Service: WalletV2Service) {}

  public ngOnInit(): void {
    this.cashWalletSubscription = this.walletV2Service.wallet$
      .pipe(map((wallet: Wallet) => wallet.cash))
      .subscribe((cashWallet: WalletCurrency) => {
        if (!cashWallet || !cashWallet.stripeDetails) return;
        this.hasAccount = cashWallet.stripeDetails.hasAccount;
      });
  }

  public ngOnDestroy(): void {
    this.cashWalletSubscription?.unsubscribe();
  }
}
