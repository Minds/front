import { NgModule } from '@angular/core';

import { CanaryPageComponent } from './page.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarketingModule } from '../marketing/marketing.module';

const routes: Routes = [
  {
    path: '',
    component: CanaryPageComponent,
    data: {
      title: 'Canary',
      description: 'Receive the latest Minds features before everyone else',
      ogImage: '/assets/og-images/canary.png',
      ogImageWidth: 400,
      ogImageHeight: 76,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MarketingModule,
  ],
  declarations: [CanaryPageComponent],
  exports: [CanaryPageComponent],
})
export class CanaryModule {}
