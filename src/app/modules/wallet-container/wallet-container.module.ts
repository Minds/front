import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { WalletContainerComponent } from './wallet-container.component';
import { CommonModule } from '../../common/common.module';
import { WalletModule } from '../wallet/wallet.module';
import { WalletV2Module } from '../wallet/v2/wallet-v2.module';
import { FeaturesService } from '../../services/features.service';
import { WalletDashboardComponent } from '../wallet/v2/dashboard.component';
import { WalletComponent } from '../wallet/wallet.component';

import { PointsOverviewComponent } from '../wallet/points-overview.component';
import { WalletOverviewComponent } from '../wallet/overview/overview.component';
import { WalletTransactionsComponent } from '../wallet/transactions/transactions.component';
import { WalletPointsTransactionsComponent } from '../wallet/transactions/points.component';
import { WalletPurchaseComponent } from '../wallet/purchase/purchase.component';
import { WalletWireComponent } from '../wallet/wire/wire.component';
import { WalletToggleComponent } from '../wallet/toggle.component';
import { WalletFlyoutComponent } from '../wallet/flyout/flyout.component';
import { WalletTokensComponent } from '../wallet/tokens/tokens.component';
import { WalletPointsComponent } from '../wallet/points/points.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WalletTokenSettingsComponent } from '../wallet/tokens/settings/settings.component';
import { WalletTokenTransactionsComponent } from '../wallet/tokens/transactions/transactions.component';
import { WalletTokenContributionsComponent } from '../wallet/tokens/contributions/contributions.component';
import { WalletTokenWithdrawComponent } from '../wallet/tokens/withdraw/withdraw.component';
import { WalletTokenJoinComponent } from '../wallet/tokens/join/join.component';
import { WalletBalanceUSDComponent } from '../wallet/balances/usd/balance.component';
import { WalletBalanceTokensComponent } from '../wallet/balances/tokens/balance.component';
import { WalletBalanceRewardsComponent } from '../wallet/balances/rewards/balance.component';
import { WalletUSDComponent } from '../wallet/usd/usd.component';
import { WalletUSDEarningsComponent } from '../wallet/usd/earnings.component';
import { WalletUSDTransactionsComponent } from '../wallet/usd/transactions.component';
import { WalletUSDPayoutsComponent } from '../wallet/usd/payouts.component';
import { WalletUSDSettingsComponent } from '../wallet/usd/settings.component';
import { WalletUSDOnboardingComponent } from '../wallet/usd/onboarding/onboarding.component';
import { WalletUSDTermsComponent } from '../wallet/usd/terms.component';
import { WalletTokenWithdrawLedgerComponent } from '../wallet/tokens/withdraw/ledger/ledger.component';
import { WalletTokenAddressesComponent } from '../wallet/tokens/addresses/addresses.component';
import { TokenOnboardingModule } from '../wallet/tokens/onboarding/onboarding.module';
import { WalletTokenContributionsOverviewComponent } from '../wallet/tokens/contributions/overview.component';
import { WalletTokenContributionsChartComponent } from '../wallet/tokens/contributions/chart.component';
import { WalletToken101Component } from '../wallet/tokens/101/101.component';
import { ModalsModule } from '../modals/modals.module';
import { ReferralsModule } from '../wallet/tokens/referrals/referrals.module';
import { ReferralsComponent } from '../wallet/tokens/referrals/referrals.component';
import { WalletUSDBalanceComponent } from '../wallet/usd/balance.component';
import { Routes, RouterModule } from '@angular/router';

const walletContainerRoutes: Routes = [
  {
    path: 'wallet',
    component: WalletContainerComponent,
    data: {
      title: 'Wallet',
      description: 'Manage all of your transactions and earnings on Minds',
      ogImage: '/assets/photos/graph.jpg',
    },
  },
];
@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    WalletModule,
    WalletV2Module,
    ReferralsModule,
    ModalsModule,
    RouterModule.forChild(walletContainerRoutes),
  ],
  declarations: [WalletContainerComponent],
  entryComponents: [
    WalletContainerComponent,
    WalletDashboardComponent,
    WalletComponent,
    PointsOverviewComponent,
    WalletOverviewComponent,
    WalletTransactionsComponent,
    WalletPointsTransactionsComponent,
    WalletPurchaseComponent,
    WalletWireComponent,
    WalletToggleComponent,
    WalletFlyoutComponent,
    WalletTokenTransactionsComponent,
    WalletTokenContributionsComponent,
    WalletTokenSettingsComponent,
    WalletTokenWithdrawLedgerComponent,
    WalletTokenWithdrawComponent,
    WalletTokenJoinComponent,
    WalletTokensComponent,
    WalletPointsComponent,
    WalletBalanceUSDComponent,
    WalletBalanceTokensComponent,
    WalletBalanceRewardsComponent,
    WalletUSDComponent,
    WalletUSDEarningsComponent,
    WalletUSDTransactionsComponent,
    WalletUSDPayoutsComponent,
    WalletUSDSettingsComponent,
    WalletUSDOnboardingComponent,
    WalletUSDTermsComponent,
    WalletTokenAddressesComponent,
    WalletTokenContributionsOverviewComponent,
    WalletTokenContributionsChartComponent,
    WalletToken101Component,
    WalletUSDBalanceComponent,

    ReferralsComponent,
  ],
  providers: [FeaturesService],
})
export class WalletContainerModule {}
