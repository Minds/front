import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';

import { MarketingFeaturesComponent } from './features.component';
import { MarketingComponent } from './marketing.component';
import { MarketingFooterComponent } from './footer.component';
import { MarketingAsFeaturedInComponent } from './as-featured-in.component';
import { MarketingAsFeaturedInBlockchainComponent } from './as-featured-in-blockchain/as-featured-in-blockchain.component';
import { LanguageModule } from '../language/language.module';

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
    MarketingFeaturesComponent,
    MarketingComponent,
    MarketingFooterComponent,
    MarketingAsFeaturedInComponent,
    MarketingAsFeaturedInBlockchainComponent,
  ],
  exports: [
    MarketingFeaturesComponent,
    MarketingComponent,
    MarketingFooterComponent,
    MarketingAsFeaturedInComponent,
    MarketingAsFeaturedInBlockchainComponent,
  ],
})
export class MarketingModule {}
