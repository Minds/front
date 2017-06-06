import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { MonetizationOverviewComponent } from './overview.component';
import { AffiliateMarketingComponent } from './affiliate/marketing.component';

const monetizationRoutes : Routes = [
  { path: 'affiliates',  component: AffiliateMarketingComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(monetizationRoutes)
  ],
  declarations: [
    MonetizationOverviewComponent,
    AffiliateMarketingComponent
  ],
  exports: [
    MonetizationOverviewComponent,
    AffiliateMarketingComponent,
    RouterModule
  ],
  entryComponents: [ MonetizationOverviewComponent, AffiliateMarketingComponent ]
})

export class MonetizationModule {}
