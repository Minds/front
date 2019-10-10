import { Component } from '@angular/core';
import { WireCreatorComponent } from '../creator.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  providers: [CurrencyPipe],
  selector: 'm-wire__paymentsCreator',
  templateUrl: 'payments.creator.component.html',
})
export class WirePaymentsCreatorComponent extends WireCreatorComponent {}
