import { NgModule } from '@angular/core';

import { MobileMarketingComponent } from './marketing/marketing.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { MobileService } from './mobile.service';
import { HttpClient } from '@angular/common/http';
import { FeaturesService } from '../../services/features.service';
import { Session } from '../../services/session';
import { MarketingModule } from '../marketing/marketing.module';

const routes: Routes = [
  {
    path: '',
    component: MobileMarketingComponent,
    data: {
      title: 'Mobile App',
      description:
        'Download the Minds mobile app and use the leading alternative social media platform anywhere. Available on both iOS & Android.',
      ogImage: '/assets/og-images/mobile.png',
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
    MarketingModule,
  ],
  declarations: [MobileMarketingComponent],
  exports: [MobileMarketingComponent],
  providers: [
    {
      provide: MobileService,
      useFactory: MobileService._,
      deps: [HttpClient, FeaturesService, Session],
    },
  ],
})
export class MobileModule {}
