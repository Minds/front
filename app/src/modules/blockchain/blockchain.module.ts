import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { AdsModule } from '../ads/ads.module';
import { LegacyModule } from '../legacy/legacy.module';
import { MindsFormsModule } from '../forms/forms.module';

import { BlockchainMarketingComponent } from './marketing/marketing.component';

const routes: Routes = [
  { path: 'token', component: BlockchainMarketingComponent },
  { path: 'crypto', component: BlockchainMarketingComponent },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ModalsModule,
    AdsModule,
    LegacyModule,
    MindsFormsModule,
  ],
  declarations: [
    BlockchainMarketingComponent,
  ],
  exports: [
    BlockchainMarketingComponent,
  ],
})
export class BlockchainModule {
}
