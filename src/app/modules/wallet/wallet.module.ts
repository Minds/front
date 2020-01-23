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
import { WalletUSDTransactionsComponent } from './usd/transactions.component';
import { WalletUSDPayoutsComponent } from './usd/payouts.component';
import { WalletUSDSettingsComponent } from './usd/settings.component';
import { WalletUSDOnboardingComponent } from './usd/onboarding/onboarding.component';
import { WalletUSDTermsComponent } from './usd/terms.component';
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
import { WalletUSDBalanceComponent } from './usd/balance.component';
import { WalletDashboardComponent } from './v2/dashboard.component';
import { WalletBalanceTokensV2Component } from './v2/balance-tokens/balance-tokens.component';
import { WalletChartComponent } from './v2/chart/chart.component';
import { WalletTransactionsTableComponent } from './v2/transactions-table/transactions-table.component';
import { WalletRewardsPopupComponent } from './v2/rewards-popup/rewards-popup.component';
import { WalletDashboardService } from './v2/dashboard.service';
import { WalletSettingsTokensComponent } from './v2/settings-tokens/settings-tokens.component';
import { WalletSettingsUSDComponent } from './v2/settings-usd/settings-usd.component';
import { WalletSettingsETHComponent } from './v2/settings-eth/settings-eth.component';
import { WalletSettingsBTCComponent } from './v2/settings-btc/settings-btc.component';
import { WalletTokenOnboardingComponent } from './v2/token-onboarding/token-onboarding.component';
import { WalletModalComponent } from './v2/modal/modal.component';
import { WalletPhoneVerificationComponent } from './v2/phone-verification/phone-verification.component';
import { WalletOnchainTransferComponent } from './v2/onchain-transfer/onchain-transfer.component';
import { WalletBalanceUsdV2Component } from './v2/balance-usd/balance-usd.component';
import { WalletPendingUsdPayoutComponent } from './v2/pending-usd-payout/pending-usd-payout.component';
import { WalletTransactionsTokensComponent } from './v2/transactions-tokens/transactions-tokens.component';
import { WalletTransactionsUsdComponent } from './v2/transactions-usd/transactions-usd.component';

const walletRoutes: Routes = [
  {
    path: 'wallet',
    component: WalletComponent,
    children: [
      { path: '', redirectTo: 'tokens', pathMatch: 'full' },
      { path: 'overview', redirectTo: 'tokens', pathMatch: 'full' },
      { path: '101', redirectTo: 'tokens/101', pathMatch: 'full' },
      // { path: 'overview', component: WalletOverviewComponent },
      // { path: 'points', component: WalletPointsComponent },
      // { path: 'points/purchase', component: WalletPurchaseComponent },
      {
        path: 'tokens',
        component: WalletTokensComponent,
        children: [
          { path: '', redirectTo: 'contributions', pathMatch: 'full' },
          {
            path: 'transactions/:contract',
            component: WalletTokenTransactionsComponent,
          },
          { path: 'transactions', component: WalletTokenTransactionsComponent },
          { path: 'withdraw', component: WalletTokenWithdrawComponent },
          { path: 'contributions/join', component: WalletTokenJoinComponent },
          {
            path: 'contributions',
            component: WalletTokenContributionsComponent,
          },
          { path: 'addresses', component: WalletTokenAddressesComponent },
          { path: '101', component: WalletToken101Component },
          { path: 'testnet', component: WalletTokenTestnetComponent },
          { path: 'referrals', component: ReferralsComponent },
        ],
      },
      {
        path: 'usd',
        component: WalletUSDComponent,
        children: [
          { path: '', redirectTo: 'transactions', pathMatch: 'full' },
          { path: 'transactions', component: WalletUSDTransactionsComponent },
          { path: 'earnings', component: WalletUSDEarningsComponent },
          { path: 'payouts', component: WalletUSDPayoutsComponent },
          { path: 'settings', component: WalletUSDSettingsComponent },
          { path: 'onboarding', component: WalletUSDOnboardingComponent },
        ],
      },
      { path: 'wire', component: WalletWireComponent },
      { path: '**', component: WalletOverviewComponent },
    ],
  },
  {
    path: 'v2wallet',
    // TODOOJM: choose actual path.
    // TODOOJM:IMPORTANT - when switching, also change 'v2wallet'... in dashboard.html (scrollToTokenSettings()).
    // TODOOJM: also allow **
    redirectTo: 'v2wallet/tokens/overview',
    pathMatch: 'full',
  },
  { path: 'v2wallet/:currency/:view', component: WalletDashboardComponent },
  { path: 'v2wallet/:currency', component: WalletDashboardComponent },
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
    WalletTokenTestnetComponent,
    WalletUSDBalanceComponent,
    WalletDashboardComponent,
    WalletChartComponent,
    WalletRewardsPopupComponent,
    WalletTransactionsTableComponent,
    WalletSettingsTokensComponent,
    WalletSettingsUSDComponent,
    WalletSettingsETHComponent,
    WalletSettingsBTCComponent,
    WalletTokenOnboardingComponent,
    WalletModalComponent,
    WalletPhoneVerificationComponent,
    WalletOnchainTransferComponent,
    WalletBalanceTokensV2Component,
    WalletBalanceUsdV2Component,
    WalletPendingUsdPayoutComponent,
    WalletTransactionsTokensComponent,
    WalletTransactionsUsdComponent,
  ],
  exports: [
    WalletComponent,
    PointsOverviewComponent,
    WalletTransactionsComponent,
    WalletPointsTransactionsComponent,
    WalletPurchaseComponent,
    WalletWireComponent,
    WalletToggleComponent,
    WalletFlyoutComponent,
    WalletBalanceUSDComponent,
    WalletBalanceTokensComponent,
    WalletUSDBalanceComponent,
  ],
  entryComponents: [WalletComponent, WalletUSDTermsComponent],
  providers: [WalletDashboardService],
})
export class WalletModule {}
