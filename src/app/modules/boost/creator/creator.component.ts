/**
 * Boost creator modal
 * TODO: Refactor / rebuild - legacy USD code is not functional.
 **/
import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import * as BN from 'bn.js';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';
import { BoostContractService } from '../../blockchain/contracts/boost-contract.service';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { OffchainPaymentService } from '../../blockchain/offchain-payment.service';
import { GetMetamaskComponent } from '../../blockchain/metamask/getmetamask.component';
import { Router } from '@angular/router';
import { Storage } from '../../../services/storage';

type CurrencyType = 'offchain' | 'usd' | 'onchain' | 'creditcard';
export type BoostType = 'p2p' | 'newsfeed' | 'content';

interface BoostStruc {
  amount: number | '';
  currency: CurrencyType | null;
  type: BoostType | null;

  categories: string[];
  priority: boolean;

  target: any;
  scheduledTs: number;
  postToFacebook: boolean;

  nonce: any;
  checksum: string;
}

export class VisibleBoostError extends Error {
  visible: boolean = true;
}

@Component({
  moduleId: module.id,
  providers: [CurrencyPipe],
  selector: 'm-boost--creator',
  templateUrl: 'creator.component.html',
})
export class BoostCreatorComponent implements AfterViewInit {
  object: any = {};

  boost: BoostStruc = {
    amount: 1000,
    currency: 'offchain',
    type: null,

    // General
    categories: [],
    priority: false,

    // P2P
    target: null,
    postToFacebook: false,
    scheduledTs: null,

    // Payment
    nonce: null,
    checksum: null,
  };

  allowedTypes: { newsfeed?; p2p?; content? } = {};

  categories: { id; label }[] = [];
  selectedCategories: Array<any>;

  rates = {
    balance: null,
    rate: 1,
    min: 250,
    cap: 5000,
    usd: 1000,
    tokens: 1000,
    minUsd: 1,
    priority: 1,
    maxCategories: 3,
  };

  step: number = 0;

  estimatedTime: number = -1;

  editingAmount: boolean = false;
  editingTarget: boolean = false;

  inProgress: boolean = false;
  initialized: boolean = false;

  success: boolean = false;
  criticalError: boolean = false;
  error: string = '';

  wasAmountChanged: boolean = false;
  defaultAmount: number | '' = this.boost.amount;

  @Input('object') set data(object) {
    this.object = object;
  }

  @ViewChild('amountEditor', { static: false })
  private _amountEditor: ElementRef;

  constructor(
    public session: Session,
    private _changeDetectorRef: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private client: Client,
    private currency: CurrencyPipe,
    private tokensContract: TokenContractService,
    private boostContract: BoostContractService,
    private web3Wallet: Web3WalletService,
    private offchainPayment: OffchainPaymentService,
    protected router: Router,
    protected storage: Storage
  ) {}

  ngOnInit() {
    this.getPreferredPaymentMethod();
    this.load();
  }

  ngAfterViewInit() {
    this.syncAllowedTypes();
  }

  getPreferredPaymentMethod() {
    let currency = this.storage.get('preferred-payment-method');
    if (['offchain', 'onchain'].indexOf(currency) !== -1)
      this.boost.currency = <CurrencyType>(currency ? currency : 'offchain');
    else {
      this.boost.currency = 'offchain';
    }
  }

  // Load settings

  /**
   * Loads boost settings from server
   */
  load() {
    // TODO: Move to service and cache (maybe?)
    this.inProgress = true;

    return this.client
      .get(`api/v2/boost/rates`)
      .then((rates: any) => {
        this.inProgress = false;
        this.rates = rates;

        // TODO: Implement in backend and remove below
        this.rates = {
          maxCategories: 3,
          ...this.rates,
        };
        this.calcEstimatedCompletionTime();
        //
      })
      .catch(e => {
        this.inProgress = false;
        this.criticalError = true;
        this.error = 'Internal server error';
      });
  }

  // General

  /**
   * Enables and disables types based on the current object
   */
  syncAllowedTypes() {
    if (!this.object || !this.object.type) {
      this.allowedTypes = {};
      this.boost.type = null;
      return;
    }

    switch (this.object.type) {
      case 'activity':
        this.allowedTypes = {
          newsfeed: true,
          p2p: true,
        };
        this.boost.type = 'newsfeed';
        break;

      default:
        this.allowedTypes = {
          content: true,
        };
        this.boost.type = 'content';
        break;
    }
  }

  /**
   * Sets the boost type
   */
  setBoostType(type: BoostType | null) {
    this.boost.type = type;
    this.roundAmount();
    this.calcEstimatedCompletionTime();
    this.showErrors(true);

    if (type === 'p2p' && this.boost.currency === 'usd') {
      this.setBoostCurrency('creditcard');
    } else if (type !== 'p2p' && this.boost.currency === 'creditcard') {
      this.setBoostCurrency('usd');
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
    this.boost.nonce = null;
    this.roundAmount();
    this.showErrors(true);
  }

  /**
   * Sets the boost payment nonce
   */
  setBoostNonce(nonce: any) {
    this.boost.nonce = nonce;
    this.showErrors();
  }

  // Read and edit amount

  /**
   * Activates and sets focus on amount editor
   */
  amountEditorFocus() {
    this.editingAmount = true;

    if (!this.boost.amount || !this.wasAmountChanged) {
      this.boost.amount = '';
    }

    this._changeDetectorRef.detectChanges();
  }

  setBoostAmount(amount: string) {
    this.wasAmountChanged = true;

    if (!amount) {
      this.boost.amount = 0;
      return;
    }
    amount = amount.replace(/,/g, '');

    if (this.boost.type !== 'p2p') {
      this.boost.amount = parseInt(amount);
    } else {
      this.boost.amount = parseFloat(amount);
    }

    this.calcEstimatedCompletionTime(true);
  }

  /**
   * Deactivates amount editor and post-process its value
   */
  amountEditorBlur() {
    this.editingAmount = false;

    if (!this.wasAmountChanged) {
      this.boost.amount = this.defaultAmount;
      return;
    }

    if (!this.boost.amount) {
      this.boost.amount = 0;
    }

    if (this.boost.amount < 0) {
      this.boost.amount = 0;
    }

    this.roundAmount();
    this.showErrors(true);
  }

  /**
   * Round by 2 decimals if P2P and currency is unset or usd. If not, round by 4 decimals.
   */
  roundAmount() {
    if (this.boost.currency === 'usd') {
      this.boost.amount =
        Math.round(parseFloat(`${this.boost.amount}`) * 100) / 100;
    } else {
      this.boost.amount =
        Math.round(parseFloat(`${this.boost.amount}`) * 10000) / 10000;
    }
  }

  /**
   * Calculates estimated completion time based on the current boosts backlog and the inputted amount
   */
  calcEstimatedCompletionTime(refresh: boolean = false) {
    if (this.boost.type !== 'p2p') {
      if (this.estimatedTime === -1 || refresh) {
        this.client
          .get('api/v2/boost/estimated', { impressions: this.boost.amount })
          .then((res: any) => {
            this.estimatedTime = res.average || -1;
          });
      }
    } else {
      this.estimatedTime = -1;
    }
  }

  // Charge and rates

  /**
   * Calculates base charges (not including priority or any other % based fee)
   */
  calcBaseCharges(type: CurrencyType): number {
    // P2P is bid based.
    if (this.boost.type === 'p2p') {
      return <number>this.boost.amount;
    }

    // Non-P2P should do the views <-> currency conversion
    switch (type) {
      case 'usd':
        const usdFixRate = this.rates.usd / 100;
        return Math.ceil(<number>this.boost.amount / usdFixRate) / 100;

      default:
        const tokensFixRate = this.rates.tokens / 10000;
        return Math.ceil(<number>this.boost.amount / tokensFixRate) / 10000;
    }
  }

  /**
   * Calculate charges including priority
   */
  calcCharges(type: CurrencyType): number {
    const charges = this.calcBaseCharges(type);

    return charges + charges * this.getPriorityRate();
  }

  /**
   * Calculate priority charges (for its preview)
   */
  calcPriorityChargesPreview(type: CurrencyType): number {
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

  // Categories

  /**
   * Toggles a category based on its current status
   */
  toggleCategory(id: string) {
    if (this.hasCategory(id)) {
      this.boost.categories.splice(this.boost.categories.indexOf(id), 1);
    } else {
      if (this.boost.categories.length >= this.rates.maxCategories) {
        return;
      }

      this.boost.categories.push(id);
    }
  }

  /**
   * Checks if a category is toggled
   */
  hasCategory(id: string) {
    return this.boost.categories.indexOf(id) > -1;
  }

  // Priority

  /**
   * Toggles the priority based on its current status
   */
  togglePriority() {
    this.boost.priority = !this.boost.priority;
    this.showErrors(true);
  }

  // Read and edit target

  setBoostTarget() {
    this.showErrors(true);
  }

  // Submit

  /**
   * Validates if the boost can be submitted using the current settings
   */
  validateBoost() {
    if (this.boost.amount <= 0) {
      throw new Error('Amount should be greater than zero.');
    }

    if (!this.boost.currency) {
      throw new Error('You should select a currency.');
    }

    if (!this.boost.type) {
      throw new Error('You should select a type.');
    }

    switch (this.boost.currency) {
      case 'usd':
        if (!this.boost.nonce) {
          throw new Error('Payment method not processed.');
        }

        if (this.calcCharges(this.boost.currency) < this.rates.minUsd) {
          throw new VisibleBoostError(
            `You must spend at least ${this.currency.transform(
              this.rates.minUsd,
              'USD',
              true
            )} USD`
          );
        }
        break;
    }

    if (this.boost.priority && this.boost.currency !== 'usd') {
      throw new VisibleBoostError(
        'The only supported payment method for priority boosts is credit card'
      );
    }

    if (this.boost.type === 'p2p') {
      if (!this.boost.target) {
        throw new Error('You should select a target.');
      }

      if (this.boost.target.guid === this.session.getLoggedInUser().guid) {
        throw new VisibleBoostError('You cannot boost to yourself.');
      }

      if (this.boost.currency === 'onchain' && !this.boost.target.eth_wallet) {
        throw new VisibleBoostError(
          'Boost target should have a Receiver Address.'
        );
      }

      if (
        (this.boost.currency === 'offchain' ||
          this.boost.currency === 'creditcard') &&
        !this.boost.target.rewards
      ) {
        throw new VisibleBoostError(
          'Boost target should participate in the Rewards program.'
        );
      }
    } else {
      if (
        this.boost.currency === 'offchain' &&
        (this.boost.amount < this.rates.min ||
          this.boost.amount > this.rates.cap)
      ) {
        throw new VisibleBoostError(
          `You must boost between ${this.rates.min} and ${this.rates.cap} views.`
        );
      }

      if (
        this.boost.currency === 'onchain' &&
        (this.boost.amount < this.rates.min ||
          this.boost.amount > this.rates.cap)
      ) {
        throw new VisibleBoostError(
          `You must boost between ${this.rates.min} and ${this.rates.cap} views.`
        );
      }

      //if (!this.boost.categories.length) {
      //  throw new Error('You should select a category.');
      //}
    }
  }

  /**
   * Checks if the user can submit using the current settings
   */
  canSubmit() {
    try {
      this.validateBoost();
      return true;
    } catch (e) {
      // console.log(`Invalid boost: ${e.visible ? '[USERFACING] ' : ''}${e.message}`);
    }

    return false;
  }

  /**
   * Shows visible boost errors
   */
  showErrors(reset: boolean = false) {
    if (reset) {
      this.error = '';
    }

    try {
      this.validateBoost();
    } catch (e) {
      if (e.visible) {
        this.error = e.message;
      }
    }
  }

  next() {
    this.step++;
  }

  back() {
    this.step--;
  }

  /**
   * Submits the boost to the appropiate server endpoint using the current settings
   */
  async submit() {
    this.error = '';

    if (this.inProgress) {
      return;
    }

    if (!this.canSubmit()) {
      this.showErrors(true);
      return;
    }

    this.inProgress = true;

    let guid = null;

    try {
      if (this.boost.currency !== 'usd') {
        const prepared = await this.prepare(this.object.guid);

        guid = prepared.guid;
        this.boost.checksum = prepared.checksum;
      }

      if (this.boost.type !== 'p2p') {
        switch (this.boost.currency) {
          case 'onchain':
            await this.web3Wallet.ready();

            const tokensFixRate = this.rates.tokens / 10000;
            let amount =
              Math.ceil(<number>this.boost.amount / tokensFixRate) / 10000;

            if (this.web3Wallet.isUnavailable()) {
              throw new Error('No Ethereum wallets available on your browser.');
            }

            if (await this.web3Wallet.isLocal()) {
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

            if (!(await this.web3Wallet.unlock())) {
              throw new Error(
                'Your Ethereum wallet is locked or connected to another network.'
              );
            }

            this.boost.nonce = {
              method: 'onchain',
              txHash: await this.boostContract.create(
                guid,
                amount,
                this.boost.checksum
              ),
              address: await this.web3Wallet.getCurrentWallet(true),
            };
            break;

          case 'offchain':
            this.boost.nonce = {
              method: 'offchain',
              address: 'offchain',
            };
        }

        await this.client.post(
          `api/v2/boost/${this.object.type}/${this.object.guid}/${this.object.owner_guid}`,
          {
            guid,
            bidType: this.boost.currency === 'usd' ? 'usd' : 'tokens',
            impressions: this.boost.amount,
            categories: this.boost.categories,
            priority: this.boost.priority ? 1 : null,
            paymentMethod: this.boost.nonce,
            checksum: this.boost.checksum,
          }
        );
      } else {
        const tokenDec = new BN(10).pow(new BN(18)).toString();
        let bid: number = (this.boost.amount || 0) * tokenDec;

        switch (this.boost.currency) {
          case 'onchain':
            await this.web3Wallet.ready();

            if (this.web3Wallet.isUnavailable()) {
              throw new Error('No Ethereum wallets available on your browser.');
            } else if (!(await this.web3Wallet.unlock())) {
              throw new Error(
                'Your Ethereum wallet is locked or connected to another network.'
              );
            }

            this.boost.nonce = {
              method: 'onchain',
              txHash: await this.boostContract.createPeer(
                this.boost.target.eth_wallet,
                guid,
                <number>this.boost.amount,
                this.boost.checksum
              ),
              address: await this.web3Wallet.getCurrentWallet(true),
            };
            break;

          case 'offchain':
            this.boost.nonce = {
              method: 'offchain',
              address: 'offchain',
            };
            break;

          case 'creditcard':
            this.boost.nonce = {
              method: 'creditcard',
              address: 'creditcard',
              token: this.boost.nonce,
            };
            throw new Error('Credit Card offer boost is deprecated');
          // break;
        }

        await this.client.post(
          `api/v2/boost/peer/${this.object.guid}/${this.object.owner_guid}`,
          {
            guid,
            currency: 'tokens',
            bid: bid.toString(),
            destination: this.boost.target.guid,
            scheduledTs: this.boost.scheduledTs,
            postToFacebook: this.boost.postToFacebook ? 1 : null,
            paymentMethod: this.boost.nonce,
            checksum: this.boost.checksum,
          }
        );
      }

      this.success = true;

      setTimeout(() => {
        this.overlayModal.dismiss();
      }, 2500);
    } catch (e) {
      if (e && e.stage === 'transaction') {
        throw new Error(
          'Sorry, your payment failed. Please, try again, use another card or wallet.'
        );
      } else {
        this.error = (e && e.message) || 'Sorry, something went wrong';
        console.warn(this.error);
      }
    } finally {
      this.inProgress = false;
    }
  }

  async prepare(entityGuid: string) {
    const { guid, checksum }: any =
      (await this.client.get(`api/v2/boost/prepare/${entityGuid}`)) || {};

    if (!guid) {
      throw new Error('Cannot generate GUID');
    }

    return { guid, checksum };
  }
}
