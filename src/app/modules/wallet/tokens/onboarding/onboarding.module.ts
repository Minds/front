import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../../../common/common.module';
import { BlockchainModule } from '../../../blockchain/blockchain.module';
import { TokenOnboardingComponent } from './onboarding.component';
import { TokenIntroductionOnboardingComponent } from './introduction/introduction.component';
import { TokenRewardsOnboardingComponent } from './rewards/rewards.component';
import { TokenOnChainOnboardingComponent } from './onchain/onchain.component';
import { TokenCompletedOnboardingComponent } from './completed/completed.component';
import { TokenOnboardingVideoComponent } from './video.component';
import { TokenOnboardingService } from './onboarding.service';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BlockchainModule,
    RouterModule,
  ],
  declarations: [
    TokenOnboardingComponent,
    TokenIntroductionOnboardingComponent,
    TokenRewardsOnboardingComponent,
    TokenOnChainOnboardingComponent,
    TokenCompletedOnboardingComponent,
    TokenOnboardingVideoComponent,
  ],
  exports: [
    TokenOnboardingComponent,
    TokenRewardsOnboardingComponent,
    TokenOnChainOnboardingComponent,
  ],
  providers: [
    {
      provide: TokenOnboardingService,
      useClass: TokenOnboardingService,
    },
  ],
})
export class TokenOnboardingModule {}
