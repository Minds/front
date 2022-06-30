import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';

import { MarketingComponent } from './marketing.component';
import { MarketingFooterComponent } from './footer.component';
import { MarketingAsFeaturedInComponent } from './as-featured-in.component';
import { MarketingAsFeaturedInBlockchainComponent } from './as-featured-in-blockchain/as-featured-in-blockchain.component';
import { LanguageModule } from '../language/language.module';
import { MarketingAsFeaturedInV2Component } from './v2/as-featured-in.component';

@NgModule({
  imports: [
    NgCommonModule,
    NgFormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    ModalsModule,
    LanguageModule,
  ],
  declarations: [
    MarketingComponent,
    MarketingFooterComponent,
    MarketingAsFeaturedInComponent,
    MarketingAsFeaturedInV2Component,
    MarketingAsFeaturedInBlockchainComponent,
  ],
  exports: [
    MarketingComponent,
    MarketingFooterComponent,
    MarketingAsFeaturedInComponent,
    MarketingAsFeaturedInV2Component,
    MarketingAsFeaturedInBlockchainComponent,
  ],
})
export class MarketingModule {}
