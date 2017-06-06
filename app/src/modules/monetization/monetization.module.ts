import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { MonetizationOverviewComponent } from './overview.component';
import { AffiliateMarketingComponent } from './affiliate/marketing.component';
import { RevenueConsoleComponent } from './revenue/console.component';

const monetizationRoutes : Routes = [
  { path: 'affiliates',  component: AffiliateMarketingComponent },
  { path: 'wallet/revenue', component: RevenueConsoleComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(monetizationRoutes)
  ],
  declarations: [
    MonetizationOverviewComponent,
    AffiliateMarketingComponent,
    RevenueConsoleComponent
  ],
  exports: [
    MonetizationOverviewComponent,
    AffiliateMarketingComponent,
    RevenueConsoleComponent,
    RouterModule
  ],
  entryComponents: [ MonetizationOverviewComponent, AffiliateMarketingComponent, RevenueConsoleComponent ]
})

export class MonetizationModule {}
