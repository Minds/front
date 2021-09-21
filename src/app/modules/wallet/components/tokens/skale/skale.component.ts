import { Component, OnInit } from '@angular/core';
import { SkaleService } from './skale.service';
import { InputBalance, TransactableCurrency } from './skale.types';

/**
 * SKALE component, giving users the ability to swap between networks.
 */
@Component({
  selector: 'm-wallet__skale',
  templateUrl: 'skale.component.html',
  styleUrls: ['./skale.component.ng.scss'],
})
export class WalletSkaleSummaryComponent implements OnInit {
  // amount we are transacting.
  public amount: number = 0;

  // current input currency we and converting FROM.
  public inputCurrency: TransactableCurrency = 'MINDS';

  // balance, held with active input currency for display purposes.
  public balance: InputBalance = {
    currency: 'MINDS',
    amount: 0,
  };

  constructor(private service: SkaleService) {}

  ngOnInit(): void {
    // TODO: if we are on the SKALE network after reload, we should get SKALE balance instead.
    this.getMainnetTokenBalance().then(balance => {
      this.balance = {
        currency: 'MINDS',
        amount: balance / 1000000000000000000,
      };
    });
  }

  /**
   * Calls either withdraw or deposit depending on the currency inputCurrency.
   * @returns { Promise<void> }
   */
  public async transfer(): Promise<void> {
    if (this.inputCurrency === 'MINDS') {
      this.deposit();
    } else {
      this.withdraw();
    }
  }

  /**
   * Calls to approve amount via the service.
   * @returns { void }
   */
  public approve(): void {
    this.service.approve(this.amount ?? 0);
  }

  /**
   * Calls to switch network to Rinkeby via service.
   * @returns { void }
   */
  public switchNetworkRinkeby(): void {
    this.service.switchNetworkRinkeby();
  }

  /**
   * Calls to switch network to SKALE via service.
   * @returns { void }
   */
  public async switchNetworkSkale(): Promise<void> {
    await this.service.switchNetworkSkale();
    // TODO: see if we can persist state to automatically set the inputCurrency
    // and determine balance on reload.
  }

  /**
   * Calls to deposit via service.
   * @returns { void }
   */
  private deposit(): void {
    this.service.deposit(this.amount ?? 0);
  }

  /**
   * Calls to withdraw via the service.
   * @returns { void }
   */
  private withdraw(): void {
    this.service.withdraw(this.amount ?? 0);
  }

  /**
   * Calls to get mainnet token balance from service
   * @returns { Promise<number> }
   */
  private async getMainnetTokenBalance(): Promise<number> {
    return this.service.getMainnetTokenBalance();
  }

  /**
   * Swaps input currency fields around.
   * @returns { void }
   */
  public swapCurrencyFields(): void {
    this.inputCurrency = this.inputCurrency === 'MINDS' ? 'skMINDS' : 'MINDS';
  }

  /**
   * Current output currency (inverse of inputCurrency)
   * @returns { TransactableCurrency } - 'MINDS', or 'skMINDS'.
   */
  get ouputCurrency(): TransactableCurrency {
    return this.inputCurrency === 'MINDS' ? 'skMINDS' : 'MINDS';
  }
}
