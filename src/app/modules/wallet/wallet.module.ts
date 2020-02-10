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
import { ReferralsModule } from './tokens/referrals/referrals.module';
import { ReferralsComponent } from './tokens/referrals/referrals.component';
import { WalletUSDBalanceComponent } from './usd/balance.component';

const walletRoutes: Routes = [
  {
    path: 'wallet',
    component: WalletComponent,
    data: {
      title: 'Wallet',
      description: 'Manage all of your transactions and earnings on Minds',
      ogImage: '/assets/photos/graph.jpg',
    },
    children: [
      { path: '', redirectTo: 'tokens', pathMatch: 'full' },
      { path: 'overview', redirectTo: 'tokens', pathMatch: 'full' },
      { path: '101', redirectTo: 'tokens/101', pathMatch: 'full' },
      {
        path: 'tokens',
        component: WalletTokensComponent,
        data: {
          title: 'Tokens',
          description: 'Keep track of your tokens',
          ogImage: '/assets/photos/graph.jpg',
        },
        children: [
          { path: '', redirectTo: 'contributions', pathMatch: 'full' },
          {
            path: 'transactions/:contract',
            component: WalletTokenTransactionsComponent,
          },
          {
            path: 'transactions',
            component: WalletTokenTransactionsComponent,
            data: {
              title: 'Transactions Ledger',
            },
          },
          {
            path: 'withdraw',
            component: WalletTokenWithdrawComponent,
            data: {
              title: 'Withdraw',
            },
          },
          { path: 'contributions/join', component: WalletTokenJoinComponent },
          {
            path: 'contributions',
            component: WalletTokenContributionsComponent,
            data: {
              title: 'Contributions',
            },
          },
          {
            path: 'addresses',
            component: WalletTokenAddressesComponent,
            data: {
              title: 'Token / ETH Addresses',
            },
          },
          {
            path: '101',
            component: WalletToken101Component,
            data: {
              title: 'Token 101',
              description: 'Everything you need to know about Minds Tokens',
              ogImage: 'assets/photos/canyon.jpg',
            },
          },
          {
            path: 'referrals',
            component: ReferralsComponent,
            data: {
              title: 'Referrals',
            },
          },
        ],
      },
      {
        path: 'usd',
        component: WalletUSDComponent,
        data: {
          title: 'USD',
          description: 'Keep track of your USD transactions',
          ogImage: '/assets/photos/graph.jpg',
        },
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
    WalletUSDBalanceComponent,
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
})
export class WalletModule {}
