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
import { MarkdownModule } from 'ngx-markdown';

const plusRoutes: Routes = [
  {
    path: 'plus',
    component: PlusMarketingComponent,
    data: {
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
    MarkdownModule.forRoot(),
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
