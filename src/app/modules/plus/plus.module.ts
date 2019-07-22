import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { FaqModule } from '../faq/faq.module';
import { PlusMarketingComponent } from './marketing.component';
import { PlusSubscriptionComponent } from './subscription.component';
import { PlusVerifyComponent } from './verify/verify.component';
import { PaymentPlanComponent } from './plan/payment-plan.component';

const plusRoutes : Routes = [
  { path: 'plus',  component: PlusMarketingComponent }
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckoutModule,
    FaqModule,
    RouterModule.forChild(plusRoutes)
  ],
  declarations: [
    PlusMarketingComponent,
    PlusSubscriptionComponent,
    PlusVerifyComponent,
    PaymentPlanComponent,
  ],
  exports: [
    PlusSubscriptionComponent,
    PlusVerifyComponent
  ],
  entryComponents: [
    PlusMarketingComponent,
    PaymentPlanComponent,
  ]
})

export class PlusModule {}
