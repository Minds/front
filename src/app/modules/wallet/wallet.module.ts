import { NgModule, Injectable, Inject, APP_INITIALIZER } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { AdsModule } from '../ads/ads.module';
import { WireModule } from '../wire/wire.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { PlusModule } from '../plus/plus.module';

import { WalletComponent } from './wallet.component';
import { WalletWireComponent } from './wire/wire.component';
import { WalletToggleComponent } from './toggle.component';
import { WalletFlyoutComponent } from './flyout/flyout.component';
import { WalletTokensComponent } from './tokens/tokens.component';
import { WalletTokenSettingsComponent } from './tokens/settings/settings.component';
import { WalletTokenTransactionsComponent } from './tokens/transactions/transactions.component';
import { WalletTokenContributionsComponent } from './tokens/contributions/contributions.component';
import { WalletTokenWithdrawComponent } from './tokens/withdraw/withdraw.component';
import { WalletTokenJoinComponent } from './tokens/join/join.component';
import { WalletBalanceUSDComponent } from './balances/usd/balance.component';
import { WalletBalanceTokensComponent } from './balances/tokens/balance.component';
import { WalletBalanceRewardsComponent } from './balances/rewards/balance.component';
import { WalletTokenWithdrawLedgerComponent } from './tokens/withdraw/ledger/ledger.component';
import { WalletTokenAddressesComponent } from './tokens/addresses/addresses.component';
import { TokenOnboardingModule } from './tokens/onboarding/onboarding.module';
import { WalletTokenContributionsOverviewComponent } from './tokens/contributions/overview.component';
import { WalletTokenContributionsChartComponent } from './tokens/contributions/chart.component';
import { WalletToken101Component } from './tokens/101/101.component';
import { ModalsModule } from '../modals/modals.module';
import { ReferralsModule } from './tokens/referrals/referrals.module';
import { ReferralsComponent } from './tokens/referrals/referrals.component';
import { WalletV2Module } from './v2/wallet-v2.module';
import { WALLET_V2_ROUTES } from '../wallet/v2/wallet-v2.module';
import { BlockchainConsoleComponent } from '../blockchain/console/console.component';
import { ChartV2Module } from '../analytics/components/chart-v2/chart-v2.module';

export const WALLET_ROUTES: Routes = [
  {
    path: '',
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
          {
            path: '**',
            redirectTo: 'contributions',
          },
        ],
      },
      {
        path: 'crypto',
        component: WalletComponent,
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: BlockchainConsoleComponent },
        ],
      },
      { path: 'wire', component: WalletWireComponent },
      { path: '**', redirectTo: '/wallet/canary' },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CheckoutModule,
    //MonetizationOverviewModule,
    RouterModule,
    RouterModule.forChild([...WALLET_ROUTES, ...WALLET_V2_ROUTES]),
    AdsModule,
    WireModule,
    BlockchainModule,
    TokenOnboardingModule,
    PlusModule,
    ModalsModule,
    ReferralsModule,
    WalletV2Module,
    ChartV2Module,
  ],
  declarations: [
    WalletComponent,
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
    WalletBalanceUSDComponent,
    WalletBalanceTokensComponent,
    WalletBalanceRewardsComponent,
    WalletTokenAddressesComponent,
    WalletTokenContributionsOverviewComponent,
    WalletTokenContributionsChartComponent,
    WalletToken101Component,
  ],
  exports: [
    WalletComponent,
    WalletWireComponent,
    WalletToggleComponent,
    WalletFlyoutComponent,
    WalletBalanceUSDComponent,
    WalletBalanceTokensComponent,
  ],
})
export class WalletModule {}
