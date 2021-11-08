import { Component, OnInit } from '@angular/core';
import { SkaleService } from './skale.service';
import { InputBalance, TransactableCurrency } from './skale.types';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

/**
 * SKALE component, giving users the ability to swap between networks.
 */
@Component({
  selector: 'm-wallet__skale',
  templateUrl: 'skale.component.html',
  styleUrls: ['./skale.component.ng.scss'],
})
export class WalletSkaleComponent implements OnInit {
  // loading in progress
  public inProgress: boolean = true;

  // amount we are transacting.
  public amount: number = 0;

  // current input currency we and converting FROM.
  public inputCurrency: TransactableCurrency = 'MINDS';

  // balance, held with active input currency for display purposes.
  public balance: InputBalance = {
    currency: 'MINDS',
    amount: 0,
  };

  // token allowance
  public allowance: number = 0;

  // form for input amount
  public form: FormGroup;

  constructor(private service: SkaleService) {}

  ngOnInit(): void {
    this.initBalance(); // async

    this.form = new FormGroup({
      amount: new FormControl('', {
        validators: [
          Validators.required,
          Validators.min(0.001),
          // will update as max changes
          (control: AbstractControl) =>
            Validators.max(this.maxInputAmount)(control),
        ],
      }),
    });
  }

  /**
   * Current output currency (inverse of inputCurrency)
   * @returns { TransactableCurrency } - 'MINDS', or 'skMINDS'.
   */
  get ouputCurrency(): TransactableCurrency {
    return this.inputCurrency === 'MINDS' ? 'skMINDS' : 'MINDS';
  }

  /**
   * Max amount a user can input - returns the lowest of allowance and balance amount.
   * @returns { number } - maximum amount a user can input.
   */
  get maxInputAmount(): number {
    return Math.min(this.allowance, this.balance.amount);
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
   * @returns { Promise<void> }
   */
  public async switchNetworkMainnet(): Promise<void> {
    this.inProgress = true;
    await this.service.switchNetworkMainnet();
    await this.initBalance();
    this.inProgress = false;
  }

  /**
   * Calls to switch network to SKALE via service.
   * @returns { Promise<void> }
   */
  public async switchNetworkSkale(): Promise<void> {
    this.inProgress = true;
    await this.service.switchNetworkSkale();
    await this.initBalance();
    this.inProgress = false;
  }

  /**
   * Swaps input currency fields around by swapping networks
   * and triggering a reload.
   * @returns { void }
   */
  public swapCurrencyFields(): void {
    if (this.inputCurrency === 'MINDS') {
      this.switchNetworkSkale();
    } else {
      this.switchNetworkMainnet();
    }
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
   * Calls to get mainnet token balance from service
   * @returns { Promise<number> }
   */
  private async getSkaleTokenBalance(): Promise<number> {
    return this.service.getSkaleTokenBalance();
  }

  /**
   * Call to get the users allowance, and set class variable 'allowance' to the value.
   * @returns { Promise<void> }
   */
  private async updateAllowance(): Promise<void> {
    this.allowance = await this.service.getERC20Allowance();
    this.inProgress = false;
  }

  /**
   * Inits balances and calls to get allowance.
   * @returns { Promise<void> }
   */
  private async initBalance(): Promise<void> {
    if (await this.service.isOnMainnet()) {
      this.inputCurrency = 'MINDS';

      const balance = await this.getMainnetTokenBalance();

      this.balance = {
        currency: 'MINDS',
        amount: balance / 1000000000000000000,
      };
    } else if (await this.service.isOnSkaleNetwork()) {
      this.inputCurrency = 'skMINDS';

      const balance = await this.getSkaleTokenBalance();
      this.balance = {
        currency: 'skMINDS',
        amount: balance / 1000000000000000000,
      };
    } else {
      console.warn('Unsupported network, please switch');
      await this.switchNetworkMainnet();
    }

    this.updateAllowance();
  }
}
