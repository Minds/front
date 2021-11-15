import { Component } from '@angular/core';
import { SkaleService } from '../skale.service';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

import { InputBalance, TransactableCurrency } from '../skale.types';
import { AbstractSubscriberComponent } from '../../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

/**
 * Skale transfer bridge component - enables transfer of MINDS to and from SKALE network.
 */
@Component({
  selector: 'm-wallet__skaleTransferBridge',
  templateUrl: 'transfer-bridge.component.html',
  styleUrls: ['./transfer-bridge.component.ng.scss', '../skale-common.ng.scss'],
})
export class WalletSkaleTransferBridgeComponent extends AbstractSubscriberComponent {
  // loading in progress
  public inProgress: boolean = true;

  // balance, held with active input currency for display purposes.
  public balance: InputBalance = {
    currency: 'MINDS',
    amount: 0,
  };

  // token allowance
  public allowance: number = 0;

  // form for input amount
  public form: FormGroup;

  constructor(private service: SkaleService) {
    super();
  }

  ngOnInit(): void {
    this.initBalance(); // async

    this.form = new FormGroup({
      inputAmount: new FormControl('', {
        validators: [
          Validators.required,
          Validators.min(0.001),
          // will update as max changes
          (control: AbstractControl) =>
            Validators.max(this.maxInputAmount)(control),
        ],
      }),
      outputAmount: new FormControl('', {
        validators: [
          Validators.required,
          Validators.min(0.001),
          // will update as max changes
          (control: AbstractControl) =>
            Validators.max(this.maxInputAmount)(control),
        ],
      }),
    });

    const outputAmountControl = this.form.get('outputAmount');
    const inputAmountControl = this.form.get('inputAmount');

    // mirror input and output amounts as MINDS and skMINDS have a 1:1 ratio.
    this.subscriptions.push(
      outputAmountControl.valueChanges.subscribe((value: number) =>
        inputAmountControl.setValue(value, { emitEvent: false })
      ),
      inputAmountControl.valueChanges.subscribe((value: number) =>
        outputAmountControl.setValue(value, { emitEvent: false })
      )
    );
  }

  /**
   * Input amounts value from form.
   * @returns { number } the value of the input amount.
   */
  get inputAmountValue(): number {
    return this.form.get('inputAmount').value;
  }

  /**
   * Gets the current input currency from current network.
   * @returns { Observable<TransactableCurrency> } current input currency
   */
  get inputCurrency$(): Observable<TransactableCurrency> {
    return of(this.service.isOnMainnet() ? 'MINDS' : 'skMINDS');
  }

  /**
   * Gets the current output currency, opposite to the current network.
   * @returns { Observable<TransactableCurrency> } current output currency
   */
  get outputCurrency$(): Observable<TransactableCurrency> {
    return this.inputCurrency$.pipe(
      map(inputCurrency => {
        return inputCurrency === 'MINDS' ? 'skMINDS' : 'MINDS';
      })
    );
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
    this.subscriptions.push(
      this.inputCurrency$
        .pipe(
          take(1),
          map(inputCurrency => {
            if (inputCurrency === 'MINDS') {
              this.deposit();
            } else {
              this.withdraw();
            }
          })
        )
        .subscribe()
    );
  }

  /**
   * Calls to approve amount via the service.
   * @returns { void }
   */
  public approve(): void {
    this.service.approve(this.inputAmountValue ?? 0);
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
    this.subscriptions.push(
      this.inputCurrency$
        .pipe(
          take(1),
          map(inputCurrency => {
            if (inputCurrency === 'MINDS') {
              this.switchNetworkSkale();
            } else {
              this.switchNetworkMainnet();
            }
          })
        )
        .subscribe()
    );
  }

  /**
   * Calls to deposit via service.
   * @returns { void }
   */
  private deposit(): void {
    this.service.deposit(this.inputAmountValue ?? 0);
  }

  /**
   * Calls to withdraw via the service.
   * @returns { void }
   */
  private withdraw(): void {
    this.service.withdraw(this.inputAmountValue ?? 0);
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
      const balance = await this.getMainnetTokenBalance();

      this.balance = {
        currency: 'MINDS',
        amount: balance / 1000000000000000000,
      };
    } else if (await this.service.isOnSkaleNetwork()) {
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
