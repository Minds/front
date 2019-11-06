import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockchainModule } from '../blockchain.module';
import { BlockchainMarketingTokenComponent } from './token.component';
import { BlockchainMarketingRewardsComponent } from './rewards.component';

const routes: Routes = [
  {
    path: 'tokens',
    redirectTo: 'token',
  },
  {
    path: 'token',
    component: BlockchainMarketingTokenComponent,
  },
  {
    path: 'reward',
    redirectTo: 'rewards',
  },
  {
    path: 'rewards',
    component: BlockchainMarketingRewardsComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BlockchainModule,
  ],
  declarations: [
    BlockchainMarketingTokenComponent,
    BlockchainMarketingRewardsComponent,
  ],
})
export class BlockchainMarketingModule {}
