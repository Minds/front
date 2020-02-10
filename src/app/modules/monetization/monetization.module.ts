import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { WalletModule } from '../wallet/wallet.module';
import { FaqModule } from '../faq/faq.module';
import { MonetizationOverviewModule } from './monetization.overview.module';
import { WalletTransactionsComponent } from '../wallet/transactions/transactions.component';
import { MonetizationMarketingComponent } from './marketing.component';
import { MonetizationTermsComponent } from './terms.component';
import { MonetizationOnboardingComponent } from './onboarding/onboarding.component';
import { RevenueGraphComponent } from './revenue/graph.component';
import { RevenueLedgerComponent } from './revenue/ledger.component';
import { RevenueOptionsComponent } from './revenue/options.component';
import { WalletWireComponent } from '../wallet/wire/wire.component';
import { RevenueConsoleComponent } from './revenue/console.component';

// external
import { WalletComponent } from '../wallet/wallet.component';

const monetizationRoutes: Routes = [
  //{ path: 'affiliates',  component: AffiliateMarketingComponent },
  //{ path: 'monetization', component: MonetizationMarketingComponent },
  {
    path: 'wallet/revenue',
    component: WalletComponent,
    children: [
      { path: '', redirectTo: 'earnings', pathMatch: 'full' },
      { path: 'points', component: WalletTransactionsComponent },
      { path: 'points/:stub', component: WalletTransactionsComponent },
      { path: 'earnings', component: RevenueLedgerComponent },
      { path: 'payouts', component: RevenueLedgerComponent },
      { path: 'options', component: RevenueOptionsComponent },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    WalletModule,
    FaqModule,
    MonetizationOverviewModule,
    RouterModule.forChild(monetizationRoutes),
  ],
  declarations: [
    MonetizationMarketingComponent,
    MonetizationTermsComponent,
    MonetizationOnboardingComponent,
    RevenueGraphComponent,
    RevenueLedgerComponent,
    RevenueOptionsComponent,
    RevenueConsoleComponent,
  ],
  exports: [
    MonetizationMarketingComponent,
    MonetizationTermsComponent,
    MonetizationOnboardingComponent,
    RevenueGraphComponent,
    RevenueLedgerComponent,
    RevenueOptionsComponent,
    RouterModule,
  ],
  entryComponents: [MonetizationMarketingComponent, RevenueConsoleComponent],
})
export class MonetizationModule {}
