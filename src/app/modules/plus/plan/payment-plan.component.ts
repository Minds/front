import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { VisibleWireError, WireStruc } from '../../wire/creator/creator.component';
import { WireService } from '../../wire/wire.service';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { GetMetamaskComponent } from '../../blockchain/metamask/getmetamask.component';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';

export type PayloadType = 'onchain' | 'offchain';

@Component({
  providers: [CurrencyPipe],
  selector: 'm-payment-plan',
  templateUrl: 'payment-plan.component.html'
})

export class PaymentPlanComponent {
  minds = window.Minds;
  blockchain = window.Minds.blockchain;

  payment = {
    period: null,
    amount: null,
    recurring: null,
    entity_guid: null,
    receiver: null,
  };

  wire: WireStruc = {
    amount: 1,
    payloadType: 'onchain',
    guid: null,
    recurring: false,
    // Payment
    payload: null
  };

  balances = {
    onchain: null,
    offchain: null,
    onChainAddress: '',
    isReceiverOnchain: false,
    wireCap: null
  };

  tier?: string;

  tiers: any = {
    OFFCHAIN_MONTHLY: 'offchain month',
    OFFCHAIN_YEARLY: 'offchain year',
    OFFCHAIN_LIFETIME: 'offchain lifetime',
    ONCHAIN_YEARLY: 'onchain year',
    ONCHAIN_LIFETIME: 'onchain lifetime',
  }

  rates = {
    balance: null,
    rate: 1,
    min: 250,
    cap: 5000,
    usd: 1,
    tokens: 1,
  };

  tokenRate = '';
  error = '';
  criticalError = false;
  inProgress = false;
  submitted = false;
  success = false;
  initialized = false;

  _opts: any;
  set opts(opts: any) {
    this._opts = opts;
    this.setDefaults();
  }

  constructor(
    public session: Session,
    private cd: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private client: Client,
    private router: Router,
    private wireService: WireService,
    private web3Wallet: Web3WalletService,
    private tokenContract: TokenContractService,
  ) { }


  ngOnInit() {
    this.load()
      .then(() => {
        this.initialized = true;
      });
    this.loadBalances();
    this.loadTokenRate();
  }


  /**
   * Loads wire settings from server (using Boost rates)
   */
  load() {
    this.inProgress = true;

    return this.client.get(`api/v2/boost/rates`)
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

      this.balances.wireCap = response.wireCap;

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

  async loadTokenRate() {
    let response: any = await this.client.get(`api/v2/blockchain/rate/tokens`);

    if (response && response.rate) {
      this.tokenRate = response.rate;
    }
  }

  /**
   * Populates the wire object
   * .
   * @param {tiers} - one of this.tiers
   */
  async createWire(tier: any) {
    switch (tier) {
      case this.tiers.OFFCHAIN_MONTHLY:
        this.wire.amount = 20;
        this.setPayloadType('offchain');
        break;

      case this.tiers.OFFCHAIN_YEARLY:
        this.wire.amount = 200;
        this.setPayloadType('offchain');
        break;

      case this.tiers.OFFCHAIN_LIFETIME:
        this.wire.amount = 5000;
        this.setPayloadType('offchain');
        break;

      case this.tiers.ONCHAIN_YEARLY:
        this.wire.amount = 40;
        this.setPayloadType('onchain');
        break;

      case this.tiers.ONCHAIN_LIFETIME:
        this.wire.amount = 400;
        this.setPayloadType('onchain');
        break;
    }

    this.wire.recurring = false;
    this.wire.guid = this.minds.blockchain.plus_guid;
  }

  async submit() {
    this.createWire(this.tier);

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

      if (await this.web3Wallet.isLocal() && this.wire.payloadType === 'onchain') {
        const action = await this.web3Wallet.setupMetamask();
        switch (action) {
          case GetMetamaskComponent.ACTION_CREATE:
            this.router.navigate(['/wallet']);
            this.inProgress = false;
            this.overlayModal.dismiss();
            break;
          case GetMetamaskComponent.ACTION_CANCEL:
            return;
        }
      }

      let { done } = await this.wireService.submitWire(this.wire, this.tier.split(' ')[1]);

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
   * Validates if the wire payment can be submitted using the current settings
   */
  validate() {
    if (this.wire.amount <= 0) {
      throw new Error('Amount should be greater than zero.');
    }
    if (!this.wire.payloadType) {
      throw new Error('You should select a payment method.');
    }

    switch (this.wire.payloadType) {
      case 'onchain':
        if (!this.wire.payload && !this.wire.payload.receiver) {
          throw new Error('Invalid receiver.');
        }
        break;

      case 'offchain':
        if (this.balances.wireCap === null) {
          // Skip client-side check until loaded
          break;
        }

        const wireCap = this.balances.wireCap / Math.pow(10, 18),
          balance = this.balances.offchain / Math.pow(10, 18);

        if (this.wire.amount > wireCap) {
          throw new VisibleWireError(`You cannot spend more than ${wireCap} tokens today.`);
        } else if (this.wire.amount > balance) {
          throw new VisibleWireError(`You cannot spend more than ${balance} tokens.`);
        }
        break;
    }

    if (!this.wire.guid) {
      throw new Error('You cannot wire this.');
    }
  }

  setDefaults() {
    this.wire.recurring = true;
    let payloadType = localStorage.getItem('preferred-payment-method');
    if (['onchain', 'offchain'].indexOf(payloadType) === -1) {
      payloadType = 'offchain';
    }
    this.setPayloadType(<PayloadType>payloadType);
  }

  /**
   * Sets the wire currency
   */
  setPayloadType(payloadType: PayloadType | null) {
    this.wire.payloadType = payloadType;

    this.wire.payload = null;

    if (payloadType === 'onchain') {
      this.setOnchainNoncePayload('');
    }

    localStorage.setItem('preferred-payment-method', payloadType);

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
   * Sets the onchain specific wire payment nonce
   */
  setOnchainNoncePayload(address: string) {
    return this.setNoncePayload({ receiver: this.blockchain.plus_address, address })
  }

  /**
  * Round by 4
  */
  roundAmount() {
    this.wire.amount = Math.round(parseFloat(`${this.wire.amount}`) * 10000) / 10000;
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
}
