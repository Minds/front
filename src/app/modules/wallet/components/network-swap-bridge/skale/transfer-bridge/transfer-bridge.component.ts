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
import { NetworkSwitchService } from '../../../../../../common/services/network-switch-service';

/**
 * Skale transfer bridge component - enables transfer of MINDS to and from SKALE network.
 */
@Component({
  selector: 'm-wallet__skaleTransferBridge',
  templateUrl: 'transfer-bridge.component.html',
  styleUrls: ['./transfer-bridge.component.ng.scss'],
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

  // whether user CAN request funds from faucet.
  public canRequestFromFaucet: boolean = false;

  // whether faucet request is in progress.
  public faucetInProgress: boolean = false;

  constructor(
    private service: SkaleService,
    private networkSwitch: NetworkSwitchService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initBalance(); // fires async.
    this.setupForm(); // setup input form.
    this.setupNetworkChangeSubscription(); // listen to network changes.
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
   * Label for input currency (includes network in brackets)
   * @returns { string } - label for input currency.
   */
  get inputCurrencyLabel$(): Observable<string> {
    return this.inputCurrency$.pipe(
      map(inputCurrency => {
        return inputCurrency === 'MINDS'
          ? 'MINDS (Mainnet)'
          : 'skMINDS (SKALE)';
      })
    );
  }

  /**
   * Label for output currency (includes network in brackets)
   * @returns { string } - label for output currency.
   */
  get outputCurrencyLabel$(): Observable<string> {
    return this.outputCurrency$.pipe(
      map(outputCurrency => {
        return outputCurrency === 'MINDS'
          ? 'MINDS (Mainnet)'
          : 'skMINDS (SKALE)';
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
  }

  /**
   * Calls to switch network to SKALE via service.
   * @returns { Promise<void> }
   */
  public async switchNetworkSkale(): Promise<void> {
    this.inProgress = true;
    await this.service.switchNetworkSkale();
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
    this.setCanRequestFromFaucet();
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

  /**
   * Sets up amount input form.
   * @returns { void }
   */
  private setupForm(): void {
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
   * Sets up subscription to network change that reinitializes balance on switch.
   * @returns { void }
   */
  private setupNetworkChangeSubscription(): void {
    this.subscriptions.push(
      this.networkSwitch.networkChanged$.subscribe((network: any) => {
        this.inProgress = true;
        this.initBalance();
      })
    );
  }

  /**
   * Calls to request from faucet and handles local state changes
   * to prevent multiple calls.
   * @returns { Promise<void> }
   */
  public async onFaucetBannerClick(): Promise<void> {
    if (this.faucetInProgress) {
      return;
    }
    this.faucetInProgress = true;
    await this.service.requestFromFaucet();
    this.canRequestFromFaucet = false;
    this.faucetInProgress = false;
  }

  /**
   * Sets canRequestFromFaucet to true if the user meets criteria.
   * @returns { Promise<void> }
   */
  public async setCanRequestFromFaucet(): Promise<void> {
    this.canRequestFromFaucet = await this.service.canRequestFromFaucet();
  }
}
