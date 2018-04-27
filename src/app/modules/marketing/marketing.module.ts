import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule as NgFormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ModalsModule } from '../modals/modals.module';

import { MarketingFeaturesComponent } from './features.component';

@NgModule({
  imports: [
    NgCommonModule,
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalsModule,
  ],
  declarations: [
    MarketingFeaturesComponent,
  ],
  exports: [
    MarketingFeaturesComponent,
  ],
})

export class MarketingModule {
}
