import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ModalsModule } from '../modals/modals.module';
import { MindsFormsModule } from '../forms/forms.module';

import { HomepageV1Component } from './v1/homepage-v1.component';
import { MarketingModule } from '../marketing/marketing.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { HomepageV2Component } from './v2/homepage-v2.component';
import { HomepageRegisterComponent } from './v2/register/register.component';
import { CaptchaModule } from '../captcha/captcha.module';

const routes: Routes = [{ path: '', component: HomepageV2Component }];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    LegacyModule,
    ModalsModule,
    MindsFormsModule,
    MarketingModule,
    ExperimentsModule,
    CaptchaModule,
  ],
  declarations: [
    HomepageV1Component,
    HomepageV2Component,
    HomepageRegisterComponent,
  ],
  entryComponents: [HomepageV1Component, HomepageV2Component],
})
export class HomepageModule {}
