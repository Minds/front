import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../../common/common.module';
import { FaqModule } from '../../faq/faq.module';
import { MarketingModule } from '../../marketing/marketing.module';
import { OnboardingModule } from '../../onboarding/onboarding.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockchainMarketingComponent } from './marketing.component';
import { BlockchainPurchaseComponent } from './purchase.component';
import { BlockchainMarketingOnboardComponent } from './onboard.component';
import { ModalsModule } from '../../modals/modals.module';

const routes: Routes = [
  {
    path: 'token',
    component: BlockchainMarketingComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FaqModule,
    MarketingModule,
    ModalsModule,
  ],
  declarations: [
    BlockchainMarketingComponent,
    BlockchainMarketingOnboardComponent,
    BlockchainPurchaseComponent,
  ],
  exports: [
    BlockchainMarketingComponent,
  ],
  entryComponents: [
    BlockchainMarketingComponent,
  ]
})
export class BlockchainMarketingModule { }
