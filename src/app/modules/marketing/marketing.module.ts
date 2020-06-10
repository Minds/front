import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';

import { MarketingFeaturesComponent } from './features.component';
import { MarketingComponent } from './marketing.component';
import { MarketingFooterComponent } from './footer.component';
import { MarketingAsFeaturedInComponent } from './as-featured-in.component';
import { LanguageModule } from '../language/language.module';

@NgModule({
  imports: [
    NgCommonModule,
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalsModule,
    LanguageModule,
  ],
  declarations: [
    MarketingFeaturesComponent,
    MarketingComponent,
    MarketingFooterComponent,
    MarketingAsFeaturedInComponent,
  ],
  exports: [
    MarketingFeaturesComponent,
    MarketingComponent,
    MarketingFooterComponent,
    MarketingAsFeaturedInComponent,
  ],
})
export class MarketingModule {}
