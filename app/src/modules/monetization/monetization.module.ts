import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { MonetizationOverviewComponent } from './overview.component';
import { AffiliateMarketingComponent } from './affiliate/marketing.component';
import { RevenueConsoleComponent } from './revenue/console.component';
import { RevenueGraphComponent } from './revenue/graph.component';


const monetizationRoutes : Routes = [
  { path: 'affiliates',  component: AffiliateMarketingComponent },
  { path: 'wallet/revenue', component: RevenueConsoleComponent }
]

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(monetizationRoutes)
  ],
  declarations: [
    MonetizationOverviewComponent,
    AffiliateMarketingComponent,
    RevenueConsoleComponent,
    RevenueGraphComponent
  ],
  exports: [
    MonetizationOverviewComponent,
    AffiliateMarketingComponent,
    RevenueConsoleComponent,
    RevenueGraphComponent,
    RouterModule
  ],
  entryComponents: [ MonetizationOverviewComponent, AffiliateMarketingComponent, RevenueConsoleComponent ]
})

export class MonetizationModule {}
