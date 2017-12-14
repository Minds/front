import { Component, Input, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api';
import { Session, SessionFactory } from '../../../services/session';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';
import { BoostContractService } from '../../blockchain/contracts/boost-contract.service';

type CurrencyType = 'points' | 'usd' | 'tokens';
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
}

export class VisibleBoostError extends Error {
  visible: boolean = true;
}

@Component({
  moduleId: module.id,
  providers: [CurrencyPipe],
  selector: 'm-boost--creator',
  templateUrl: 'creator.component.html'
})
export class BoostCreatorComponent implements AfterViewInit {

  object: any = {};

  boost: BoostStruc = {
    amount: 1000,
    currency: 'points',
    type: null,

    // General
    categories: [],
    priority: false,

    // P2P
    target: null,
    postToFacebook: false,
    scheduledTs: null,

    // Payment
    nonce: null
  };

  allowedTypes: { newsfeed?, p2p?, content? } = {};

  categories: { id, label }[] = [];
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
    maxCategories: 3
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

  session: Session = SessionFactory.build();

  @Input('object') set data(object) {
    this.object = object;
  }

  @ViewChild('amountEditor') private _amountEditor: ElementRef;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private client: Client,
    private currency: CurrencyPipe,
    private tokensContract: TokenContractService,
    private boostContract: BoostContractService,
  ) { }

  ngOnInit() {
    this.load();
  }

  ngAfterViewInit() {
    this.syncAllowedTypes();
    this.amountEditorFocus();
  }

  // Load settings

  /**
   * Loads boost settings from server
   */
  load() {
    // TODO: Move to service and cache (maybe?)
    this.inProgress = true;

    return this.client.get(`api/v1/boost/rates`)
      .then((rates: any) => {
        this.inProgress = false;
        this.rates = rates;

        // TODO: Implement in backend and remove below
        this.rates = {
          maxCategories: 3,
          ...this.rates
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
          p2p: true
        };
        this.boost.type = 'newsfeed';
        break;

      default:
        this.allowedTypes = {
          content: true
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
    this.showErrors();
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
    this.showErrors();
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

    if (!this.boost.amount) {
      this.boost.amount = '';
    }

    this._changeDetectorRef.detectChanges();

    //if (this._amountEditor.nativeElement) {
    //  setTimeout(() => (<HTMLInputElement>this._amountEditor.nativeElement).focus(), 100);
    //}
  }

  setBoostAmount(amount: string) {
    if (!amount) {
      this.boost.amount = 0;
      return;
    }
    amount = amount.replace(/,/g, '');
    this.boost.amount = parseInt(amount);

    this.calcEstimatedCompletionTime(true);
  }

  /**
   * Deactivates amount editor and post-process its value
   */
  amountEditorBlur() {
    this.editingAmount = false;

    if (!this.boost.amount) {
      this.boost.amount = 0;
    }

    if (this.boost.amount < 0) {
      this.boost.amount = 0;
    }

    this.roundAmount();
    this.showErrors();
  }

  /**
   * Round by 2 decimals if P2P and currency is unset or not points. If not, round down to an integer.
   */
  roundAmount() {
    if ((this.boost.type === 'p2p') && (!this.boost.currency || (this.boost.currency === 'usd'))) {
      this.boost.amount = Math.round(parseFloat(`${this.boost.amount}`) * 100) / 100;
    } else if (this.boost.currency === 'tokens') {
      this.boost.amount = Math.round(parseFloat(`${this.boost.amount}`) * 10000) / 10000;
    } else {
      this.boost.amount = Math.floor(<number>this.boost.amount);
    }
  }

  /**
   * Calculates estimated completion time based on the current boosts backlog and the inputted amount
   */
  calcEstimatedCompletionTime(refresh: boolean = false) {
    if (this.boost.type !== 'p2p') {
      if (this.estimatedTime === -1 || refresh) {
        this.client.get('api/v1/boost/estimated', { impressions: this.boost.amount }).then((res: any) => {
          this.estimatedTime = res.average || -1;
        })
      }
    } else {
      this.estimatedTime = -1;
    }
  }

  // Charge and rates

  /**
   * Calculates base charges (not including priority or any other % based fee)
   */
  calcBaseCharges(type: string): number {
    // P2P should just round down amount points. It's bid based.
    if (this.boost.type === 'p2p') {
      switch (type) {
        case 'points':
          return Math.floor(<number>this.boost.amount);
      }

      return <number>this.boost.amount;
    }

    // Non-P2P should do the views <-> currency conversion
    switch (type) {
      case 'usd':
        const usdFixRate = this.rates.usd / 100;
        return Math.ceil(<number>this.boost.amount / usdFixRate) / 100;

      case 'points':
        return Math.floor(<number>this.boost.amount / this.rates.rate);

      case 'tokens':
        const tokensFixRate = this.rates.tokens / 10000;
        return Math.ceil(<number>this.boost.amount / tokensFixRate) / 10000;
    }

    throw new Error('Unknown currency');
  }

  /**
   * Calculate charges including priority
   */
  calcCharges(type: string): number {
    const charges = this.calcBaseCharges(type);

    return charges + (charges * this.getPriorityRate());
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
    this.showErrors();
  }

  // Read and edit target

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

    if (this.boost.currency === 'points') {
      const charges = this.calcCharges(this.boost.currency);

      if ((this.rates.balance !== null) && (charges > this.rates.balance)) {
        throw new VisibleBoostError(`You only have ${this.rates.balance} points.`);
      }
    } else {
      if (!this.boost.nonce) {
        throw new Error('Payment method not processed.');
      }
    }

    if (this.boost.type === 'p2p') {
      if (!this.boost.target) {
        throw new Error('You should select a target.');
      }

      if (this.boost.target && (this.boost.target.guid === this.session.getLoggedInUser().guid)) {
        throw new VisibleBoostError('You cannot boost to yourself.');
      }

      if (this.boost.target && !this.boost.target.merchant && (this.boost.currency === 'usd')) {
        throw new VisibleBoostError('User cannot receive USD.');
      }

      if (this.boost.target && !this.boost.target.eth_wallet && (this.boost.currency === 'tokens')) {
        throw new VisibleBoostError('User cannot receive MindsCoin.');
      }
    } else {
      if (this.boost.amount < this.rates.min || this.boost.amount > this.rates.cap) {
        throw new VisibleBoostError(`You must boost between ${this.rates.min} and ${this.rates.cap} views.`);
      }

      //if (!this.boost.categories.length) {
      //  throw new Error('You should select a category.');
      //}
    }

    if (this.boost.currency === 'usd') {
      if (this.calcCharges(this.boost.currency) < this.rates.minUsd) {
        throw new VisibleBoostError(`You must spend at least ${this.currency.transform(this.rates.minUsd, 'USD', true)} USD`);
      }
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
  showErrors() {
    this.error = '';

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
    if (this.inProgress) {
      return;
    }

    if (!this.canSubmit()) {
      this.showErrors();
      return;
    }

    this.inProgress = true;

    let guid = null;

    try {
      if (this.boost.currency === 'tokens') {
        guid = await this.generateGuid();
      }

      if (this.boost.type !== 'p2p') {
        if (this.boost.currency === 'tokens') {
          const tokensFixRate = this.rates.tokens / 10000;
          let amount = Math.ceil(<number>this.boost.amount / tokensFixRate) / 10000;

          this.boost.nonce.txHash = await this.boostContract.create(guid, amount);
        }

        await this.client.post(`api/v1/boost/${this.object.type}/${this.object.guid}/${this.object.owner_guid}`, {
          guid,
          bidType: this.boost.currency,
          impressions: this.boost.amount,
          categories: this.boost.categories,
          priority: this.boost.priority ? 1 : null,
          paymentMethod: this.boost.nonce
        });
      } else {
        if (this.boost.currency === 'tokens') {
          this.boost.nonce.txHash = await this.boostContract.createPeer(this.boost.target.eth_wallet, guid, <number>this.boost.amount);
        }

        await this.client.post(`api/v1/boost/peer/${this.object.guid}/${this.object.owner_guid}`, {
          guid,
          type: this.boost.currency === 'points' ? 'points' : 'pro',
          currency: this.boost.currency,
          bid: this.boost.amount,
          destination: this.boost.target.guid,
          scheduledTs: this.boost.scheduledTs,
          postToFacebook: this.boost.postToFacebook ? 1 : null,
          nonce: this.boost.nonce
        });
      }

      this.success = true;

      setTimeout(() => {
        this.overlayModal.dismiss();
      }, 2500);
    } catch (e) {
      if (e && e.stage === 'transaction') {
        throw new Error('Sorry, your payment failed. Please, try again, use another card or wallet.');
      } else {
        this.error = (e && e.message) || 'Sorry, something went wrong';
      }
    } finally {
      this.inProgress = false;
    }
  }

  generateGuid() {
    return this.client.get('api/v1/guid')
      .then((response: any) => {
        if (!response || !response.guid) {
          throw new Error('Cannot generate GUID');
        }

        return response.guid;
      })
  }

}
