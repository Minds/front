import { Component, Input } from '@angular/core';
import { WireCreatorComponent } from '../creator.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  providers: [CurrencyPipe],
  selector: 'm-wire__paymentsCreator',
  templateUrl: 'payments.creator.component.html',
})
export class WirePaymentsCreatorComponent extends WireCreatorComponent {
  @Input('opts') set opts(opts) {
    this._opts = opts;
    this.wire.amount = opts.amount;
    this.wire.recurringInterval = opts.interval;
    switch (opts.currency) {
      case 'tokens':
        this.wire.payloadType = 'offchain';
        break;
      default:
        this.wire.payloadType = opts.currency;
    }
  }

  ngOnInit() {}
}
