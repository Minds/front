import { Component, Input, Output, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

type CurrencyType = 'points' | 'usd' | 'tokens';

@Component({
  providers: [ CurrencyPipe ],
  selector: 'm-boost--creator-checkout',
  templateUrl: 'checkout.component.html'
})
export class BoostCreatorCheckoutComponent {

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

  setNonce(nonce) {
    this.boost.nonce = nonce;
    this.boostChanged.next(this.boost);
  }
}
