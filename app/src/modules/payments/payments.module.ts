import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { ModalsModule } from '../modals/modals.module';

import { PayWall } from './paywall/paywall.component';
import { PaywallCancelButton } from './paywall/paywall-cancel.component';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    CheckoutModule,
    ModalsModule
  ],
  declarations: [
    PayWall,
    PaywallCancelButton,
  ],
  exports: [
    PayWall,
    PaywallCancelButton,
  ]
})
export class PaymentsModule {
}
