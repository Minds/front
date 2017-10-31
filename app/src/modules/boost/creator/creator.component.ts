import { Component, Input, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api';
import { Session, SessionFactory } from '../../../services/session';

type CurrencyType = 'points' | 'usd' | 'btc';
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

  nonce: string;
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
    nonce: ''
  };

  allowedTypes: { newsfeed?, p2p?, content?} = {};

  categories: { id, label }[] = [];

  rates = {
    balance: null,
    rate: 1,
    min: 250,
    cap: 5000,
    usd: 1000,
    btc: 0,
    minUsd: 1,
    priority: 1,
    maxCategories: 3
  };

  editingAmount: boolean = false;
  editingTarget: boolean = false;

  targetQuery: string = '';
  targetResults: any[] = [];

  inProgress: boolean = false;

  success: boolean = false;
  criticalError: boolean = false;
  error: string = '';

  session: Session = SessionFactory.build();

  @Input('object') set data(object) {
    this.object = object;
  }

  private _searchThrottle;

  @ViewChild('amountEditor') private _amountEditor: ElementRef;
  @ViewChild('targetEditor') private _targetEditor: ElementRef;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private client: Client,
    private currency: CurrencyPipe
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.load();
  }

  ngAfterViewInit() {
    this.syncAllowedTypes();
    this.amountEditorFocus();
  }

  // Load settings

  /**
   * Loads and parses categories from global variable
   */
  loadCategories() {
    this.categories = [];

    for (let id in window.Minds.categories) {
      this.categories.push({
        id: id,
        label: window.Minds.categories[id]
      });
    }

    this.categories.sort((a, b) => a.label > b.label ? 1 : -1);
  }

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
          btc: 0,
          maxCategories: 3,

          ...this.rates
        };
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
    this.showErrors();
  }

  /**
   * Sets the boost currency, and rounds the amount if necessary
   */
  setBoostCurrency(currency: CurrencyType | null) {
    this.boost.currency = currency;
    this.roundAmount();
    this.showErrors();
  }

  /**
   * Sets the boost payment nonce
   */
  setBoostNonce(nonce: string | null) {
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
    if ((this.boost.type === 'p2p') && (!this.boost.currency || (this.boost.currency !== 'points'))) {
      this.boost.amount = Math.round(parseFloat(`${this.boost.amount}`) * 100) / 100;
    } else {
      this.boost.amount = Math.floor(<number>this.boost.amount);
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

      case 'btc':
        return 0; // TODO: Implement BTC
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

  /**
   * Activates and sets focus on the target editor
   */
  targetEditorFocus() {
    this.editingTarget = true;
    this._changeDetectorRef.detectChanges();

    if (this._targetEditor.nativeElement) {
      setTimeout(() => (<HTMLInputElement>this._targetEditor.nativeElement).focus(), 100);
    }
  }

  /**
   * Deactivates the target editor
   */
  targetEditorBlur() {
    this.editingTarget = false;
    this.showErrors();
  }

  /**
   * Searches the current target query on the server
   */
  searchTarget() {
    if (this._searchThrottle) {
      clearTimeout(this._searchThrottle);
      this._searchThrottle = void 0;
    }

    if (this.targetQuery.charAt(0) !== '@') {
      this.targetQuery = '@' + this.targetQuery;
    }

    let query = this.targetQuery;
    if (query.charAt(0) === '@') {
      query = query.substr(1);
    }

    if (!query || query.length <= 2) {
      this.targetResults = [];
      return;
    }

    this._searchThrottle = setTimeout(() => {
      this.client.get(`api/v2/search/suggest/user`, {
        q: query,
        limit: 8,
        hydrate: 1
      })
        .then(({ entities }) => {
          if (!entities) {
            return;
          }

          this.targetResults = entities;
        })
        .catch(e => console.error('Cannot load results', e));
    });
  }

  /**
   * Sets the current target for a P2P boost
   */
  setTarget(target, $event?) {
    if ($event) {
      $event.preventDefault();
    }

    this.boost.target = { ...target };
    this.targetResults = [];
    this.targetQuery = '@' + target.username;
    this.showErrors();
  }

  // Boost Pro
  togglePostToFacebook() {
    this.boost.postToFacebook = !this.boost.postToFacebook;
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

      if (this.boost.target && !this.boost.target.merchant && (this.boost.currency !== 'points')) {
        // TODO: Implement BTC (in message)
        throw new VisibleBoostError('User cannot receive USD.');
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

  /**
   * Submits the boost to the appropiate server endpoint using the current settings
   */
  submit() {
    if (this.inProgress) {
      return;
    }

    if (!this.canSubmit()) {
      this.showErrors();
      return;
    }

    this.inProgress = true;

    let request: Promise<any>;

    if (this.boost.type !== 'p2p') {
      request = this.client.post(`api/v1/boost/${this.object.type}/${this.object.guid}/${this.object.owner_guid}`, {
        bidType: this.boost.currency,
        impressions: this.boost.amount,
        categories: this.boost.categories,
        priority: this.boost.priority ? 1 : null,
        paymentMethod: this.boost.nonce
      })
        .then(response => {
          return { done: true };
        });
    } else {
      request = this.client.post(`api/v1/boost/peer/${this.object.guid}/${this.object.owner_guid}`, {
        type: this.boost.currency === 'points' ? 'points' : 'pro', // TODO: BTC
        bid: this.boost.amount,
        destination: this.boost.target.guid,
        scheduledTs: this.boost.scheduledTs,
        postToFacebook: this.boost.postToFacebook ? 1 : null,
        nonce: this.boost.nonce
      })
        .then(response => {
          return { done: true };
        })
        .catch(e => {
          if (e && e.stage === 'transaction') {
            throw new Error('Sorry, your payment failed. Please, try again or use another card');
          }
        });
    }

    request
      .then(({ done }) => {
        this.inProgress = false;

        if (done) {
          this.success = true;

          setTimeout(() => {
            this.overlayModal.dismiss();
          }, 2500);
        }
      })
      .catch(e => {
        this.inProgress = false;
        this.error = (e && e.message) || 'Sorry, something went wrong';
      });
  }
}
