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

export { RevenueConsoleComponent } from './revenue/console.component';

export const MONETIZATION_REVENUE_COMPONENTS = [
  RevenueConsoleComponent,
  RevenueGraphComponent,
  RevenueLedgerComponent,
  RevenueOptionsComponent,
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
  ],
  declarations: [
    MonetizationMarketingComponent,
    MonetizationTermsComponent,
    MonetizationOnboardingComponent,
  ],
  exports: [
    MonetizationMarketingComponent,
    MonetizationTermsComponent,
    MonetizationOnboardingComponent,
  ],
  entryComponents: [MonetizationMarketingComponent],
})
export class MonetizationModule {}
