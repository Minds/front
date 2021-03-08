import { NgModule } from '@angular/core';

import { JobsMarketingComponent } from './marketing/marketing.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarketingModule } from '../marketing/marketing.module';

const routes: Routes = [
  {
    path: 'jobs',
    component: JobsMarketingComponent,
    data: {
      title: 'Jobs',
      description: 'Want to join the team? View our open positions.',
      ogImage: '/assets/og-images/jobs.png',
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
  declarations: [JobsMarketingComponent],
  exports: [JobsMarketingComponent],
})
export class JobsMarketingModule {}
