import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';

import { WalletDashboardComponent } from './components/dashboard.component';
import { WalletBalanceTokensV2Component } from './components/tokens/balance/balance-tokens.component';
import { WalletChartComponent } from './components/components/chart/chart.component';
import { WalletTransactionsTableComponent } from './components/components/transactions-table/transactions-table.component';
import { WalletRewardsPopupComponent } from './components/components/rewards-popup/rewards-popup.component';
import { WalletSettingsTokensComponent } from './components/tokens/settings/settings-tokens.component';
import { WalletSettingsCashComponent } from './components/cash/settings/settings-cash.component';
import { WalletSettingsETHComponent } from './components/eth/settings/settings-eth.component';
import { WalletSettingsBTCComponent } from './components/btc/settings/settings-btc.component';
import { WalletTokenOnboardingComponent } from './components/tokens/onboarding/token-onboarding.component';
import { WalletModalComponent } from './components/components/modal/modal.component';
import { WalletOnchainTransferComponent } from './components/components/onchain-transfer/onchain-transfer.component';
import { WalletBalanceCashComponent } from './components/cash/balance/balance-cash.component';
import { WalletPendingCashPayoutComponent } from './components/components/pending-cash-payout/pending-cash-payout.component';
import { WalletTransactionsTokensComponent } from './components/tokens/transactions/transactions-tokens.component';
import { WalletTransactionsCashComponent } from './components/cash/transactions/transactions-cash.component';
import { WalletCashOnboardingComponent } from './components/cash/settings/cash-onboarding/cash-onboarding.component';
import { WalletCashOnboardingExtrasComponent } from './components/cash/settings/cash-onboarding-extras/cash-onboarding-extras.component';
import { WalletCashBankFormComponent } from './components/cash/settings/cash-bank-form/cash-bank-form.component';
import { TokenContractService } from '../blockchain/contracts/token-contract.service';
import { WithdrawContractService } from '../blockchain/contracts/withdraw-contract.service';
import { ChartV2Module } from '../analytics/components/chart-v2/chart-v2.module';
import { WalletV2TokensComponent } from './components/tokens/tokens.component';
import { WalletV2CashComponent } from './components/cash/cash.component';
import { WalletV2EthComponent } from './components/eth/eth.component';
import { WalletV2BtcComponent } from './components/btc/btc.component';
import { WalletProEarningsCashComponent } from './components/cash/pro-earnings/pro-earnings.component';
import { WalletTabHistoryService } from './components/tab-history.service';
import { DefaultRedirectGuard } from './components/guards/default-redirect-guard.component';
import { TabStorageGuard } from './components/guards/tab-storage-guard.component';
import { WalletBalanceComponent } from './components/components/balance/balance.component';
import { WalletTokenRewardsComponent } from './components/tokens/rewards/rewards.component';
import { WalletEarningsComponent } from './components/components/earnings/earnings.component';
import { OnchainTransferModalService } from './components/components/onchain-transfer/onchain-transfer.service';
import { WalletTokensDropdownMenu } from './components/tokens/dropdown-menu/dropdown-menu.component';
import { WalletSharedModule } from './wallet-shared.module';
import { WalletOnchainTransfersSummaryComponent } from './components/tokens/onchain-transfers/onchain-transfers.component';

export const WALLET_ROUTES: Routes = [
  { path: 'canary', redirectTo: '..', pathMatch: 'full' },
  {
    path: '',
    component: WalletDashboardComponent,
    data: {
      title: 'Wallet',
      description: 'Manage all of your transactions and earnings on Minds',
      ogImage: '/assets/og-images/wallet-v3.png',
      ogImageWidth: 1200,
      ogImageHeight: 1200,
    },
    children: [
      {
        path: 'tokens',
        component: WalletV2TokensComponent,
        children: [
          {
            path: '',
            redirectTo: 'rewards',
            pathMatch: 'full',
          },
          {
            path: 'overview',
            redirectTo: 'balance',
            pathMatch: 'full',
          },
          {
            path: 'balance',
            canActivate: [TabStorageGuard],
            component: WalletChartComponent,
          },
          {
            path: 'rewards',
            canActivate: [TabStorageGuard],
            component: WalletTokenRewardsComponent,
          },
          {
            path: 'earnings',
            canActivate: [TabStorageGuard],
            component: WalletEarningsComponent,
            data: {},
          },
          {
            path: 'transactions',
            canActivate: [TabStorageGuard],
            component: WalletTransactionsTokensComponent,
          },
          {
            path: 'settings',
            component: WalletSettingsTokensComponent,
          },
          {
            path: 'transfers',
            component: WalletOnchainTransfersSummaryComponent,
          },
        ],
      },
      {
        path: 'cash',
        component: WalletV2CashComponent,
        children: [
          {
            path: '',
            redirectTo: 'earnings',
            pathMatch: 'full',
          },
          {
            path: 'earnings',
            component: WalletProEarningsCashComponent,
            canActivate: [TabStorageGuard],
          },
          {
            path: 'transactions',
            component: WalletTransactionsCashComponent,
            canActivate: [TabStorageGuard],
          },
          {
            path: 'settings',
            component: WalletSettingsCashComponent,
          },
        ],
      },
      {
        path: 'eth',
        component: WalletV2EthComponent,
        children: [
          {
            path: '',
            redirectTo: 'settings',
          },
          {
            path: 'settings',
            canActivate: [TabStorageGuard],
            component: WalletSettingsETHComponent,
          },
        ],
      },
      {
        path: 'btc',
        canActivate: [TabStorageGuard],
        component: WalletV2BtcComponent,
        children: [
          {
            path: '',
            redirectTo: 'settings',
          },
          {
            path: 'settings',
            component: WalletSettingsBTCComponent,
          },
        ],
      },
      {
        path: '**', // redirected by RouterRedirectGuard
        canActivate: [DefaultRedirectGuard],
      },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    RouterModule.forChild(WALLET_ROUTES),
    ChartV2Module,
    WalletSharedModule,
  ],
  declarations: [
    WalletDashboardComponent,
    WalletChartComponent,
    WalletRewardsPopupComponent,
    WalletTransactionsTableComponent,
    WalletSettingsTokensComponent,
    WalletSettingsCashComponent,
    WalletSettingsETHComponent,
    WalletSettingsBTCComponent,
    WalletTokenOnboardingComponent,
    WalletModalComponent,
    WalletOnchainTransferComponent,
    WalletBalanceTokensV2Component,
    WalletBalanceCashComponent,
    WalletProEarningsCashComponent,
    WalletPendingCashPayoutComponent,
    WalletTransactionsTokensComponent,
    WalletTransactionsCashComponent,
    WalletCashOnboardingComponent,
    WalletCashOnboardingExtrasComponent,
    WalletCashBankFormComponent,
    WalletOnchainTransfersSummaryComponent,
    // MH fixed:
    WalletV2TokensComponent,
    WalletV2CashComponent,
    WalletV2EthComponent,
    WalletV2BtcComponent,
    // V3 wallet
    WalletBalanceComponent,
    WalletTokenRewardsComponent,
    WalletEarningsComponent,
    WalletTokensDropdownMenu,
  ],
  exports: [WalletDashboardComponent],
  providers: [
    TokenContractService,
    WithdrawContractService,
    WalletTabHistoryService,
    DefaultRedirectGuard,
    TabStorageGuard,
    OnchainTransferModalService,
  ],
})
export class WalletModule {}
