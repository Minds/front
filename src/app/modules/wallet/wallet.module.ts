import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { MonetizationOverviewModule } from '../monetization/monetization.overview.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { AdsModule } from '../ads/ads.module';
import { WireModule } from '../wire/wire.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { PlusModule } from '../plus/plus.module';

import { WalletComponent } from './wallet.component';
import { PointsOverviewComponent } from './points-overview.component';
import { WalletOverviewComponent } from './overview/overview.component';
import { WalletTransactionsComponent } from './transactions/transactions.component';
import { WalletPointsTransactionsComponent } from './transactions/points.component';
import { WalletPurchaseComponent } from './purchase/purchase.component';
import { WalletWireComponent } from './wire/wire.component';
import { WalletToggleComponent } from './toggle.component';
import { WalletFlyoutComponent } from './flyout/flyout.component';
import { WalletTokensComponent } from './tokens/tokens.component';
import { WalletPointsComponent } from './points/points.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WalletTokenSettingsComponent } from './tokens/settings/settings.component';
import { WalletTokenTransactionsComponent } from './tokens/transactions/transactions.component';
import { WalletTokenContributionsComponent } from './tokens/contributions/contributions.component';
import { WalletTokenWithdrawComponent } from './tokens/withdraw/withdraw.component';
import { WalletTokenJoinComponent } from './tokens/join/join.component';
import { WalletBalanceUSDComponent } from './balances/usd/balance.component';
import { WalletBalanceTokensComponent } from './balances/tokens/balance.component';
import { WalletBalanceRewardsComponent } from './balances/rewards/balance.component';
import { WalletUSDComponent } from './usd/usd.component';
import { WalletUSDEarningsComponent } from './usd/earnings.component';
import { WalletUSDPayoutsComponent } from './usd/payouts.component';
import { WalletUSDSettingsComponent } from './usd/settings.component';
import { WalletTokenWithdrawLedgerComponent } from './tokens/withdraw/ledger/ledger.component';
import { WalletTokenAddressesComponent } from './tokens/addresses/addresses.component';
import { TokenOnboardingModule } from './tokens/onboarding/onboarding.module';
import { WalletTokenContributionsOverviewComponent } from './tokens/contributions/overview.component';
import { WalletTokenContributionsChartComponent } from './tokens/contributions/chart.component';
import { WalletToken101Component } from './tokens/101/101.component';
import { ModalsModule } from '../modals/modals.module';
import { WalletTokenTestnetComponent } from './tokens/testnet/testnet.component';
import { ReferralsModule } from './tokens/referrals/referrals.module';
import { ReferralsComponent } from './tokens/referrals/referrals.component';
import { WalletSummaryComponent } from './wallet-summary.component';
import { WalletTabsComponent } from './tabs/wallet-tabs.component';
import { WalletSettingsComponent } from './tabs/wallet-settings.component';
import { OldWalletComponent } from './old-wallet.component';
import { VerifyMobileComponent } from './verify-mobile/verify-mobile.component';
import { OnChainOnboardingComponent } from './tabs/onchain/onchain.component';
import { OnboardingVideoComponent } from './tabs/onchain/video.component';

const walletRoutes: Routes = [
  { path: 'wallet', component: OldWalletComponent,
    children: [
      { path: '', redirectTo: 'tokens', pathMatch: 'full' },
      { path: 'overview', redirectTo: 'tokens', pathMatch: 'full' },
      { path: '101', redirectTo: 'tokens/101', pathMatch: 'full' },
      // { path: 'overview', component: WalletOverviewComponent },
      // { path: 'points', component: WalletPointsComponent },
      // { path: 'points/purchase', component: WalletPurchaseComponent },
      { path: 'tokens', component: WalletTokensComponent,
        children: [
          { path: '', redirectTo: 'contributions', pathMatch: 'full' },
          { path: 'transactions/:contract', component: WalletTokenTransactionsComponent },
          { path: 'transactions', component: WalletTokenTransactionsComponent },
          { path: 'withdraw', component: WalletTokenWithdrawComponent },
          { path: 'contributions/join', component: WalletTokenJoinComponent },
          { path: 'contributions', component: WalletTokenContributionsComponent },
          { path: 'addresses', component: WalletTokenAddressesComponent },
          { path: '101', component: WalletToken101Component },
          { path: 'testnet', component: WalletTokenTestnetComponent },
          { path: 'referrals', component: ReferralsComponent },
        ]
      },
      { path: 'usd', component: WalletUSDComponent,
        children: [
          { path: '', redirectTo: 'earnings', pathMatch: 'full' },
          { path: 'earnings', component: WalletUSDEarningsComponent },
          { path: 'payouts', component: WalletUSDPayoutsComponent },
          { path: 'settings', component: WalletUSDSettingsComponent },
        ]
      },
      { path: 'wire', component: WalletWireComponent },
      { path: 'new', component: WalletComponent },
      { path: 'verify', component: VerifyMobileComponent },
      { path: '**', component: WalletOverviewComponent },
    ]
  }
];

@NgModule({
  imports: [
    NgCommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckoutModule,
    MonetizationOverviewModule,
    RouterModule.forChild(walletRoutes),
    AdsModule,
    WireModule,
    BlockchainModule,
    TokenOnboardingModule,
    PlusModule,
    ModalsModule,
    ReferralsModule,
  ],
  declarations: [
    WalletComponent,
    OldWalletComponent,
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
    WalletUSDPayoutsComponent,
    WalletUSDSettingsComponent,
    WalletTokenAddressesComponent,
    WalletTokenContributionsOverviewComponent,
    WalletTokenContributionsChartComponent,
    WalletToken101Component,
    WalletTokenTestnetComponent,
    WalletSummaryComponent,
    WalletTabsComponent,
    VerifyMobileComponent,
    WalletSettingsComponent,
    OnChainOnboardingComponent,
    OnboardingVideoComponent
  ],
  exports: [
    WalletComponent,
    OldWalletComponent,
    PointsOverviewComponent,
    WalletTransactionsComponent,
    WalletPointsTransactionsComponent,
    WalletPurchaseComponent,
    WalletWireComponent,
    WalletToggleComponent,
    WalletFlyoutComponent,
    WalletBalanceUSDComponent,
    WalletSummaryComponent,
    WalletTabsComponent,
    VerifyMobileComponent,
    WalletSettingsComponent,
    OnChainOnboardingComponent,
    OnboardingVideoComponent
  ],
  entryComponents: [ WalletComponent, OldWalletComponent ]
})

export class WalletModule {}
