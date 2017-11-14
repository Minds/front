import { Component, Input, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api';
import { Session, SessionFactory } from '../../../services/session';
import { WireService } from '../wire.service';

export type CurrencyType = 'points' | 'money' | 'btc';

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
    amount: 1000,
    currency: 'points',
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
    btc: 0,
    minUsd: 1,
  };

  editingAmount: boolean = false;

  initialized: boolean = false;
  inProgress: boolean = false;

  success: boolean = false;
  criticalError: boolean = false;
  error: string = '';

  session: Session = SessionFactory.build();

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

  constructor(
    private wireService: WireService,
    private _changeDetectorRef: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private client: Client,
    private currency: CurrencyPipe
  ) { }

  ngOnInit() {
    this.load()
      .then(() => {
        this.initialized = true;
        this.syncOwner();
      });
  }

  ngAfterViewInit() {
    this.amountEditorFocus();
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

        // TODO: Implement in backend and remove below
        this.rates = {
          btc: 0,

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

  syncOwner() {
    if (!this.owner || !this.owner.guid) {
      return;
    }

    this.client.get(`api/v1/wire/rewards/${this.owner.guid}`)
      .then(({ merchant, wire_rewards, sums }) => {
        this.owner.merchant = merchant;
        this.owner.wire_rewards = wire_rewards;
        this.sums = sums;

        this.setDefaults();
      });
  }

  setDefaults() {
    if (this._opts && this._opts.default && typeof this._opts.default === 'object') {
      this.wire.currency = this._opts.default.type;
      this.wire.amount = this._opts.default.min;

      if (!this._opts.disableThresholdCheck && this.sums && this.sums[this._opts.default.type]) {
        this.wire.amount = <number>this.wire.amount - Math.ceil(this.sums[this._opts.default.type]);
      }
    } else if (this.owner.merchant) {
      this.wire.currency = 'money';
      this.wire.amount = 1;
      this.wire.recurring = true;
    }

    if (this.wire.amount < 0) {
      this.wire.amount = 0;
    }
  }

  // General

  /**
   * Sets the wire currency, and rounds the amount if necessary
   */
  setCurrency(currency: CurrencyType | null) {
    if ((!this.owner || !this.owner.merchant) && (currency !== 'points')) {
      return;
    }

    let oldCurrency = this.wire.currency;
    this.wire.currency = currency;

    if (currency === 'points') {
      this.wire.recurring = false;
    }

    this.convertCurrency(oldCurrency, currency);
    this.roundAmount();
    this.showErrors();
  }

  /**
   * Sets the wire payment nonce
   */
  setNoncePayload(nonce: string | null) {
    this.wire.payload = { nonce };
    this.showErrors();
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

    //if (this._amountEditor.nativeElement) {
    //  setTimeout(() => (<HTMLInputElement>this._amountEditor.nativeElement).focus(), 100);
    //}
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
  * Round by 2 decimals if currency is unset or not points. If not, round down to an integer.
  */
  roundAmount() {
    if (!this.wire.currency || this.wire.currency !== 'points') {
      this.wire.amount = Math.round(parseFloat(`${this.wire.amount}`) * 100) / 100;
    } else {
      this.wire.amount = Math.floor(<number>this.wire.amount);
    }
  }

  // Charge and rates

  /**
   * Calculates base charges (any other % based fee)
   */
  calcBaseCharges(type: string): number {
    switch (type) {
      case 'points':
        return Math.floor(<number>this.wire.amount);
    }

    return <number>this.wire.amount;
  }

  // TODO: Might be used later for recurring bonuses
  /**
   * Calculate charges including priority
   */
  calcCharges(type: string): number {
    const charges = this.calcBaseCharges(type);

    return charges;
  }

  /**
   * Converts the current amount when switching currencies
   */
  convertCurrency(from: CurrencyType | null, to: CurrencyType | null) {
    if (!from || !to) {
      return;
    }

    switch (from) {
      case 'points':
        if (to === 'money') {
          this.wire.amount = <number>this.wire.amount / this.rates.usd;
        } else if (to === 'btc') {
          // TODO: BTC
        }
        break;

      case 'money':
        if (to === 'points') {
          this.wire.amount = <number>this.wire.amount * this.rates.usd;
        } else if (to === 'btc') {
          // TODO: BTC
        }
        break;

      case 'btc':
        // TODO: BTC
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

    if (this.wire.currency === 'points') {
      const charges = this.calcCharges(this.wire.currency);

      if ((this.rates.balance !== null) && (charges > this.rates.balance)) {
        throw new VisibleWireError(`You only have ${this.rates.balance} points.`);
      }
    } else {
      if (!this.wire.payload) {
        throw new Error('Payment method not processed.');
      }
    }

    if (!this.wire.guid) {
      throw new Error('You cannot wire this.');
    }

    // TODO: Maybe fetch wire's owner to check merchant status

    if (this.wire.currency === 'money') {
      if (this.calcCharges(this.wire.currency) < this.rates.minUsd) {
        throw new VisibleWireError(`You must spend at least ${this.currency.transform(this.rates.minUsd, 'USD', true)} USD`);
      }
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
    this.error = '';

    try {
      this.validate();
    } catch (e) {
      if (e.visible) {
        this.error = e.message;
      }
    }
  }

  /**
   * Submits the wire to the appropiate server endpoint using the current settings
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

    let request: Promise<any> = this.wireService.submitWire(this.wire);

    request
      .then(({ done }) => {
        this.inProgress = false;

        if (done) {
          this.success = true;

          if (this._opts && this._opts.onComplete) {
            this._opts.onComplete(this.wire);
          }

          setTimeout(() => {
            this.overlayModal.dismiss();
          }, 2500);
        }
      })
      .catch(e => {
        this.inProgress = false;
        if (e && e.message) {
          this.error = e.message;
        } else {
          this.error = 'Sorry, something went wrong';
        }
      });
  }
}
