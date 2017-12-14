import { Component, Input, Output, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

type CurrencyType = 'points' | 'usd' | 'tokens';

@Component({
  providers: [ CurrencyPipe ],
  selector: 'm-boost--creator-payment-methods',
  templateUrl: 'payment-methods.component.html'
})
export class BoostCreatorPaymentMethodsComponent {

  @Input() boost;
  @Output() boostChanged: EventEmitter<any> = new EventEmitter();

  @Input() rates = {
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

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

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

}
