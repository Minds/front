import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ModalsModule } from '../modals/modals.module';
import { MindsFormsModule } from '../forms/forms.module';

import { MarketingModule } from '../marketing/marketing.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { HomepageV2Component } from './homepage-v2.component';
import { CaptchaModule } from '../captcha/captcha.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    NgCommonModule,
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    LegacyModule,
    ModalsModule,
    MindsFormsModule,
    MarketingModule,
    ExperimentsModule,
    CaptchaModule,
    RouterModule,
  ],
  declarations: [HomepageV2Component],
  entryComponents: [HomepageV2Component],
  exports: [HomepageV2Component],
})
export class HomepageV2Module {}
