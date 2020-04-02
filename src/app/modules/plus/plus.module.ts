import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { FaqModule } from '../faq/faq.module';
import { PlusMarketingComponent } from './marketing.component';
import { PlusSubscriptionComponent } from './subscription/subscription.component';
import { PlusVerifyComponent } from './verify/verify.component';
import { PlusService } from './plus.service';

const plusRoutes: Routes = [
  {
    path: 'plus',
    component: PlusMarketingComponent,
    data: {
      title: 'Minds Plus',
      description: `Support Minds and unlock features such as hiding ads, accessing exclusive content, receiving a badge and verifying your channel.`,
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckoutModule,
    FaqModule,
    RouterModule.forChild(plusRoutes),
  ],
  declarations: [
    PlusMarketingComponent,
    PlusSubscriptionComponent,
    PlusVerifyComponent,
  ],
  exports: [PlusSubscriptionComponent, PlusVerifyComponent],
  providers: [PlusService],
  entryComponents: [PlusMarketingComponent],
})
export class PlusModule {}
