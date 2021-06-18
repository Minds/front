import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';

import { StripeCheckout } from './stripe-checkout';
import { BlockchainModule } from '../blockchain/blockchain.module';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BlockchainModule,
  ],
  declarations: [StripeCheckout],
  exports: [StripeCheckout],
})
export class CheckoutModule {}
