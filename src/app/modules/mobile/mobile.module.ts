import { NgModule } from '@angular/core';

import { MobileMarketingComponent } from './marketing/marketing.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { MobileService } from './mobile.service';
import { HttpClient } from '@angular/common/http';
import { Session } from '../../services/session';
import { MarketingModule } from '../marketing/marketing.module';
import { TenantRedirectGuard } from '../../common/guards/tenant-redirect.guard';

const routes: Routes = [
  {
    path: '',
    component: MobileMarketingComponent,
    canActivate: [TenantRedirectGuard],
    data: {
      title: 'Mobile App',
      description:
        'Download the Minds mobile app and use the leading alternative social media platform anywhere. Available on both iOS & Android.',
      ogImage: '/assets/og-images/mobile-v3.png',
      ogImageWidth: 1200,
      ogImageHeight: 1200,
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
      deps: [HttpClient, Session],
    },
  ],
})
export class MobileModule {}
