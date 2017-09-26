import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';

import { CardInput } from './card/card';
import { Checkout } from './braintree-checkout';
import { StripeCheckout } from './stripe-checkout';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    CardInput,
    Checkout,
    StripeCheckout
  ],
  exports: [
    CardInput,
    Checkout,
    StripeCheckout
  ]
})
export class CheckoutModule {
}
