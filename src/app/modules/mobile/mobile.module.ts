import { NgModule } from '@angular/core';

import { MobileMarketingComponent } from './marketing/marketing.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { MobileService } from './mobile.service';
import { HttpClient } from '@angular/common/http';
import { FeaturesService } from '../../services/features.service';
import { Session } from '../../services/session';

const routes: Routes = [
  {
    path: 'mobile',
    component: MobileMarketingComponent,
    data: {
      title: 'Minds Mobile App',
      description: 'Download the Minds mobile app for Android & iOS.',
      ogImage: '/assets/photos/mobile-app.jpg',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), NgCommonModule, CommonModule],
  declarations: [MobileMarketingComponent],
  exports: [MobileMarketingComponent],
  entryComponents: [MobileMarketingComponent],
  providers: [
    {
      provide: MobileService,
      useFactory: MobileService._,
      deps: [HttpClient, FeaturesService, Session],
    },
  ],
})
export class MobileModule {}
