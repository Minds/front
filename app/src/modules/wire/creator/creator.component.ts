import { Component, Input, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api';
import { Session, SessionFactory } from '../../../services/session';
import { WireService } from '../wire.service';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';

export type CurrencyType = 'money' | 'tokens';

export class VisibleWireError extends Error {
  visible: boolean = true;
}

export interface WireStruc {
  amount: number | '';
  currency: CurrencyType | null;
  guid: any;
  recurring: boolean;
  payload: any;
}

@Component({
  moduleId: module.id,
  providers: [CurrencyPipe],
  selector: 'm-wire--creator',
  templateUrl: 'creator.component.html'
})
export class WireCreatorComponent implements AfterViewInit {

  minds = window.Minds;

  wire: WireStruc = {
    amount: 1,
    currency: 'tokens',
    guid: null,
    recurring: false,

    // Payment
    payload: null
  };

  owner: any;

  sums: any;

  rates = {
    balance: null,
    rate: 1,
    min: 250,
    cap: 5000,
    usd: 1,
    tokens: 1,
    minUsd: 1,
  };

  editingAmount: boolean = false;

  initialized: boolean = false;
  inProgress: boolean = false;

  success: boolean = false;
  criticalError: boolean = false;
  error: string = '';

  session: Session = SessionFactory.build();

  protected submitted: boolean;

  @Input('object') set data(object) {
    this.wire.guid = object ? object.guid : null;

    if (!this.wire.guid && object.entity_guid) {
      this.wire.guid = object.entity_guid;
    }

    this.owner = void 0;

    if (object) {
      if (object.type === 'user') {
        this.owner = object;
      } else if (object.ownerObj) {
        this.owner = object.ownerObj;
      }
    }

    if (this.initialized) {
      this.syncOwner();
    }
  }

  _opts: any;
  set opts(opts: any) {
    this._opts = opts;
    this.setDefaults();
  }

  @ViewChild('amountEditor') private _amountEditor: ElementRef;

  balances = {
    onchain: null,
    offchain: null,
    onChainAddress: '',
    isReceiverOnchain: false,
  };

  constructor(
    private wireService: WireService,
    private _changeDetectorRef: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private client: Client,
    private currency: CurrencyPipe,
    private web3Wallet: Web3WalletService,
    private tokenContract: TokenContractService,
  ) { }

  ngOnInit() {
    this.load()
      .then(() => {
        this.initialized = true;
        this.syncOwner();
      });
    this.loadBalances();
  }

  ngAfterViewInit() {
    this.amountEditorFocus();
  }

  async loadBalances() {
    try {
      let currentWallet = await this.web3Wallet.getCurrentWallet();

      if (currentWallet) {
        this.loadCurrentWalletBalance(currentWallet);
      }

      let response: any = await this.client.get(`api/v2/blockchain/wallet/balance`);

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

  // Load settings

  /**
   * Loads wire settings from server (using Boost rates)
   */
  load() {
    // TODO: Move to service and cache (maybe?)
    this.inProgress = true;

    return this.client.get(`api/v1/boost/rates`)
      .then((rates: any) => {
        this.inProgress = false;
        this.rates = rates;
      })
      .catch(e => {
        this.inProgress = false;
        this.criticalError = true;
        this.error = 'Internal server error';
      });
  }

  syncOwner() {
    if (!this.owner || !this.owner.guid) {
      return;
    }

    this.client.get(`api/v1/wire/rewards/${this.owner.guid}`)
      .then(({ merchant, eth_wallet, wire_rewards, sums }) => {
        this.owner.merchant = merchant;
        this.owner.eth_wallet = eth_wallet;
        this.owner.wire_rewards = wire_rewards;
        this.sums = sums;

        this.setDefaults();
      });
  }

  setDefaults() {
    /*if (this._opts && this._opts.default && typeof this._opts.default === 'object') {
      this.wire.currency = this._opts.default.type;
      this.wire.amount = this._opts.default.min;

      if (!this._opts.disableThresholdCheck && this.sums && this.sums[this._opts.default.type]) {
        this.wire.amount = <number>this.wire.amount - Math.ceil(this.sums[this._opts.default.type]);
      }
    } else if (this.owner.eth_wallet) {*/
      this.setCurrency('tokens');
      this.wire.amount = 1;
      this.wire.recurring = true;
    /*} else if (this.owner.merchant) {
      this.setCurrency('money');
      this.wire.amount = 1;
      this.wire.recurring = true;
    } else {
      // TODO: Throw an error
    }*/

    if (this.wire.amount < 0) {
      this.wire.amount = 0;
    }
  }

  // General

  /**
   * Sets the wire currency, and rounds the amount if necessary
   */
  setCurrency(currency: CurrencyType | null) {
    /*if (
      !this.owner ||
      (!this.owner.merchant && currency === 'money') ||
      (!this.owner.eth_wallet && currency === 'tokens')
    ) {
      return;
    }*/

    let oldCurrency = this.wire.currency;
    this.wire.currency = currency;

    this.wire.payload = null;

    if (currency === 'tokens') {
      this.setTokensNoncePayload('');
    }

    this.convertCurrency(oldCurrency, currency);
    this.roundAmount();
    this.showErrors();
  }

  /**
   * Sets the wire payment nonce
   */
  setNoncePayload(nonce: any) {
    this.wire.payload = nonce;
    this.showErrors();
  }

  /**
   * Sets the tokens specific wire payment nonce
   */
  setTokensNoncePayload(address: string) {
    return this.setNoncePayload({ receiver: this.owner.eth_wallet, address })
  }

  // Read and edit amount

  /**
   * Activates and sets focus on amount editor
   */
  amountEditorFocus() {
    this.editingAmount = true;

    if (!this.wire.amount) {
      this.wire.amount = 0;
    }

    this._changeDetectorRef.detectChanges();
  }

  setAmount(amount: string) {
    if (!amount) {
      this.wire.amount = 0;
      return;
    }

    if (typeof amount === 'number') {
      this.wire.amount = amount;
      return;
    }

    amount = amount.replace(/,/g, '');
    this.wire.amount = parseFloat(amount);
  }

  /**
   * Deactivates amount editor and post-process its value
   */
  amountEditorBlur() {
    this.editingAmount = false;

    if (!this.wire.amount) {
      this.wire.amount = 0;
    }

    if (this.wire.amount < 0) {
      this.wire.amount = 0;
    }

    this.roundAmount();
    this.showErrors();
  }

  /**
  * Round by 4 if tokens, 2 on other currencies (money)
  */
  roundAmount() {
    if (this.wire.currency === 'tokens') {
      this.wire.amount = Math.round(parseFloat(`${this.wire.amount}`) * 10000) / 10000;
    } else {
      this.wire.amount = Math.round(parseFloat(`${this.wire.amount}`) * 100) / 100;
    }
  }

  // Charge and rates

  /**
   * Calculates base charges (any other % based fee)
   */
  calcBaseCharges(type: string): number {
    // NOTE: Can be used to calculate fees
    return <number>this.wire.amount;
  }

  /**
   * Calculate charges including priority
   */
  calcCharges(type: string): number {
    // NOTE: Can be used to calculate bonuses
    return this.calcBaseCharges(type);
  }

  /**
   * Converts the current amount when switching currencies
   */
  convertCurrency(from: CurrencyType | null, to: CurrencyType | null) {
    if (!from || !to) {
      return;
    }

    switch (from) {
      case 'money':
        if (to === 'tokens') {
          this.wire.amount = <number>this.wire.amount * this.rates.tokens;
        }
        break;

      case 'tokens':
        if (to === 'money') {
          this.wire.amount = <number>this.wire.amount / this.rates.tokens;
        }
        break;
    }
  }

  // Priority

  /**
   * Toggles the recurring subscription based on its current status
   */
  toggleRecurring() {
    this.wire.recurring = !this.wire.recurring;
    this.showErrors();
  }

  // Submit

  /**
   * Validates if the wire can be submitted using the current settings
   */
  validate() {
    if (this.wire.amount <= 0) {
      throw new Error('Amount should be greater than zero.');
    }

    if (!this.wire.currency) {
      throw new Error('You should select a currency.');
    }

    switch (this.wire.currency) {
      case 'money':
        if (!this.wire.payload) {
          throw new Error('Payment method not processed.');
        }

        if (this.calcCharges(this.wire.currency) < this.rates.minUsd) {
          throw new VisibleWireError(`You must spend at least ${this.currency.transform(this.rates.minUsd, 'USD', true)} USD`);
        }
        break;
    }

    if (!this.wire.guid) {
      throw new Error('You cannot wire this.');
    }
  }

  /**
   * Checks if the user can submit using the current settings
   */
  canSubmit() {
    try {
      this.validate();
      return true;
    } catch (e) {
      // console.log(`Invalid wire: ${e.visible ? '[USERFACING] ' : ''}${e.message}`);
    }

    return false;
  }

  /**
   * Shows visible wire errors
   */
  showErrors() {
    if (!this.submitted) {
      this.error = '';
    }

    try {
      this.validate();
    } catch (e) {
      if (e.visible) {
        this.error = e.message;
      }
    }
  }

  /**
   * Submits the wire
   */
  async submit() {
    if (this.inProgress) {
      return;
    }

    if (!this.canSubmit()) {
      this.showErrors();
      return;
    }

    try {
      this.inProgress = true;
      this.submitted = true;
      this.error = '';

      let { done } = await this.wireService.submitWire(this.wire);

      if (done) {
        this.success = true;

        if (this._opts && this._opts.onComplete) {
          this._opts.onComplete(this.wire);
        }

        setTimeout(() => {
          this.overlayModal.dismiss();
        }, 2500);
      }
    } catch (e) {
      this.error = (e && e.message) || 'Sorry, something went wrong';
    } finally {
      this.inProgress = false;
    }
  }

  //

  getOnChainInterfaceLabel() {
    return this.web3Wallet.getOnChainInterfaceLabel();
  }
}
