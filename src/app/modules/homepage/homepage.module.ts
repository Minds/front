import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { MindsFormsModule } from '../forms/forms.module';

import { MarketingModule } from '../marketing/marketing.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { HomepageV3Module } from '../homepage-v3/homepage-v3.module';
import { HomepageContainerComponent } from './container.component';
import { DiscoverySharedModule } from '../discovery/discovery-shared.module';
import { DefaultFeedModule } from '../default-feed/default-feed.module';

const routes: Routes = [
  {
    path: '',
    component: HomepageContainerComponent,
    data: {
      preventLayoutReset: true,
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalsModule,
    MindsFormsModule,
    MarketingModule,
    ExperimentsModule,
    DiscoverySharedModule,
    HomepageV3Module,
    DefaultFeedModule,
  ],
  declarations: [HomepageContainerComponent],
})
export class HomepageModule {}
