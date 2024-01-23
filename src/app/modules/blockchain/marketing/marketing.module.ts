import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockchainModule } from '../blockchain.module';
import { MarketingModule } from '../../marketing/marketing.module';
import { ComposerService } from '../../composer/services/composer.service';
import { BlockchainMarketingRewardsV2Component } from './v2/rewards.component';
import { OnchainTransferModalService } from '../../wallet/components/components/onchain-transfer/onchain-transfer.service';
import { WalletV2Service } from '../../wallet/components/wallet-v2.service';
import { MarkdownModule } from 'ngx-markdown';
import { MindsOnlyRedirectGuard } from '../../../common/guards/minds-only-redirect.guard';

const routes: Routes = [
  {
    path: 'reward',
    redirectTo: 'rewards',
  },
  {
    path: 'rewards',
    component: BlockchainMarketingRewardsV2Component,
    canActivate: [MindsOnlyRedirectGuard],
    data: {
      preventLayoutReset: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MarkdownModule.forRoot(),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BlockchainModule,
    MarketingModule,
  ],
  providers: [ComposerService, OnchainTransferModalService, WalletV2Service],
  declarations: [BlockchainMarketingRewardsV2Component],
})
export class BlockchainMarketingModule {}
