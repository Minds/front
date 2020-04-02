import {
  Component,
  Input,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  EventEmitter,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import { Client } from '../../../../services/api/client';
import { TokenContractService } from '../../../blockchain/contracts/token-contract.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { Router } from '@angular/router';

type CurrencyType = 'offchain' | 'usd' | 'onchain' | 'creditcard';

@Component({
  providers: [CurrencyPipe],
  selector: 'm-boost--creator-payment-methods',
  templateUrl: 'payment-methods.component.html',
})
export class BoostCreatorPaymentMethodsComponent {
  @Input() boost;
  @Output() boostChanged: EventEmitter<any> = new EventEmitter();

  @Input() rates = {
    rate: 1,
    min: 250,
    cap: 5000,
    usd: 1000,
    tokens: 1000,
    minUsd: 1,
    priority: 1,
    maxCategories: 3,
  };

  balances = {
    onchain: null,
    offchain: null,
    onChainAddress: '',
    isReceiverOnchain: false,
  };

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private web3Wallet: Web3WalletService,
    private client: Client,
    private tokenContract: TokenContractService,
    private overlayService: OverlayModalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBalances();
  }

  async loadBalances() {
    try {
      let currentWallet = await this.web3Wallet.getCurrentWallet();

      if (currentWallet) {
        this.loadCurrentWalletBalance(currentWallet);
      }

      let response: any = await this.client.get(
        `api/v2/blockchain/wallet/balance`
      );

      if (!response) {
        return;
      }

      this.balances.offchain = response.addresses[1].balance;

      if (!currentWallet) {
        this.balances.onchain = response.addresses[0].balance;
        this.balances.onChainAddress = response.addresses[0].address;
        this.balances.isReceiverOnchain = true;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async loadCurrentWalletBalance(address) {
    try {
      this.balances.onChainAddress = address;
      this.balances.isReceiverOnchain = false;

      const balance = await this.tokenContract.balanceOf(address);

      this.balances.onchain = balance[0].toString();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Sets the boost currency, and rounds the amount if necessary
   */
  setBoostCurrency(currency: CurrencyType | null) {
    if (this.boost.currency === currency) {
      return;
    }
    this.boost.currency = currency;
    localStorage.setItem('preferred-payment-method', currency);
    this.boost.nonce = null;
    this.roundAmount();
  }

  /**
   * Round by 2 decimals if P2P and currency is unset or usd. If not, round by 4 decimals.
   */
  roundAmount() {
    if (
      this.boost.type === 'p2p' &&
      (!this.boost.currency || this.boost.currency === 'usd')
    ) {
      this.boost.amount =
        Math.round(parseFloat(`${this.boost.amount}`) * 100) / 100;
    } else if (
      this.boost.currency === 'tokens' ||
      this.boost.currency === 'offchain'
    ) {
      this.boost.amount =
        Math.round(parseFloat(`${this.boost.amount}`) * 10000) / 10000;
    }
  }

  // Charge and rates

  /**
   * Calculates base charges (not including priority or any other % based fee)
   */
  calcBaseCharges(type: string): number {
    // P2P should just round down amount points. It's bid based.
    if (this.boost.type === 'p2p') {
      return <number>this.boost.amount;
    }

    const tokensFixRate = this.rates.tokens / 10000;

    // Non-P2P should do the views <-> currency conversion
    switch (type) {
      case 'usd':
        const usdFixRate = this.rates.usd / 100;
        return Math.ceil(<number>this.boost.amount / usdFixRate) / 100;

      case 'offchain':
      case 'tokens':
        return Math.ceil(<number>this.boost.amount / tokensFixRate) / 10000;
    }

    throw new Error('Unknown currency');
  }

  /**
   * Calculate charges including priority
   */
  calcCharges(type: string): number {
    const charges = this.calcBaseCharges(type);

    return charges + charges * this.getPriorityRate();
  }

  /**
   * Calculate priority charges (for its preview)
   */
  calcPriorityChargesPreview(type: string): number {
    return this.calcBaseCharges(type) * this.getPriorityRate(true);
  }

  /**
   * Gets the priority rate, only if applicable
   */
  getPriorityRate(force?: boolean): number {
    // NOTE: No priority on P2P
    if (force || (this.boost.type !== 'p2p' && this.boost.priority)) {
      return this.rates.priority;
    }

    return 0;
  }

  getOnChainInterfaceLabel() {
    return this.web3Wallet.getOnChainInterfaceLabel();
  }

  buyTokens() {
    this.overlayService.dismiss();
    this.router.navigate(['/token']);
  }
}
