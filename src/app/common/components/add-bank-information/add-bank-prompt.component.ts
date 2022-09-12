import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Wallet,
  WalletCurrency,
  WalletV2Service,
} from '../../../modules/wallet/components/wallet-v2.service';

/**
 * Prompt / banner intended for display in main content pane, indicating that a user
 * needs to connect their bank account when one is not connected.
 */
@Component({
  selector: 'm-addBankPrompt',
  templateUrl: './add-bank-prompt.component.html',
  styleUrls: ['add-bank-prompt.component.ng.scss'],
  providers: [WalletV2Service],
})
export class AddBankPromptComponent implements OnInit, OnDestroy {
  // cash wallet
  public cashWallet: WalletCurrency;

  // whether user has an account
  public hasAccount: boolean = false;

  // whether user had a bank
  public hasBank: boolean = false;

  // whether is loaded.
  public readonly loaded$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // cash wallet subscription.
  private cashWalletSubscription: Subscription;

  // should a loading spinner be shown while loading
  @Input() showLoadingSpinner: boolean = false;

  /**
   * Whether prompt should show.
   * @returns { Observable<boolean> } true if prompt should show.
   */
  get shouldShow$(): Observable<boolean> {
    return this.loaded$.pipe(
      map((loaded: boolean) => {
        return loaded && this.cashWallet && (!this.hasAccount || !this.hasBank);
      })
    );
  }

  constructor(protected walletService: WalletV2Service) {}

  ngOnInit() {
    this.cashWalletSubscription = this.walletService.wallet$
      .pipe(map((wallet: Wallet) => wallet.cash))
      .subscribe((cashWallet: WalletCurrency) => {
        this.cashWallet = cashWallet;
        this.load();
      });
    this.walletService.loadWallet(); // async
  }

  ngOnDestroy() {
    if (this.cashWalletSubscription) {
      this.cashWalletSubscription.unsubscribe();
    }
  }

  /**
   * Load to check whether user has a bank and has an account.
   * @returns { void }
   */
  private load(): void {
    if (!this.cashWallet || !this.cashWallet.stripeDetails) return;
    this.hasAccount = this.cashWallet.stripeDetails.hasAccount;
    this.hasBank = this.cashWallet.stripeDetails.hasBank;
    this.loaded$.next(true);
  }
}
