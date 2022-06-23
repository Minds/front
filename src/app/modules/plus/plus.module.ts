import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { PlusMarketingComponent } from './marketing.component';
import { PlusSubscriptionComponent } from './subscription/subscription.component';
import { PlusVerifyComponent } from './verify/verify.component';
import { PlusService } from './plus.service';
import { MarketingModule } from '../marketing/marketing.module';

const plusRoutes: Routes = [
  {
    path: 'plus',
    component: PlusMarketingComponent,
    data: {
      title: 'Minds Plus',
      description: `Support Minds and unlock features such as hiding ads, accessing exclusive content, receiving a badge and verifying your channel.`,
      canonicalUrl: '/plus',
      ogImage: '/assets/og-images/plus-v3.png',
      ogImageWidth: 1200,
      ogImageHeight: 1200,
      preventLayoutReset: true,
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(plusRoutes),
    MarketingModule,
  ],
  declarations: [
    PlusMarketingComponent,
    PlusSubscriptionComponent,
    PlusVerifyComponent,
  ],
  exports: [PlusSubscriptionComponent, PlusVerifyComponent],
  providers: [PlusService],
})
export class PlusModule {}
