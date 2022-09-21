import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { MindsFormsModule } from '../forms/forms.module';

import { MarketingModule } from '../marketing/marketing.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { HomepageV3Component } from './homepage-v3.component';
import { CaptchaModule } from '../captcha/captcha.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    NgCommonModule,
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalsModule,
    MindsFormsModule,
    MarketingModule,
    ExperimentsModule,
    CaptchaModule,
    RouterModule,
    MarketingModule,
  ],
  declarations: [HomepageV3Component],
  exports: [HomepageV3Component],
})
export class HomepageV3Module {}
