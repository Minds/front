import { NgModule, PLATFORM_ID } from '@angular/core';
import {
  CommonModule as NgCommonModule,
  NgOptimizedImage,
} from '@angular/common';
import { RouterModule, Routes, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';

import { WalletDashboardComponent } from './components/dashboard.component';
import { WalletBalanceTokensV2Component } from './components/tokens/balance/balance-tokens.component';
import { WalletTransactionsTableComponent } from './components/components/transactions-table/transactions-table.component';
import { WalletRewardsPopupComponent } from './components/components/rewards-popup/rewards-popup.component';
import { WalletSettingsTokensComponent } from './components/tokens/settings/settings-tokens.component';
import { WalletSettingsCashComponent } from './components/cash/settings/settings-cash.component';
import { WalletSettingsBTCComponent } from './components/btc/settings/settings-btc.component';
import { WalletModalComponent } from './components/components/modal/modal.component';
import { WalletOnchainTransferComponent } from './components/components/onchain-transfer/onchain-transfer.component';
import { WalletBalanceCashComponent } from './components/cash/balance/balance-cash.component';
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
import { PathMatch } from '../../common/types/angular.types';
import { WalletV2CreditsComponent } from './components/credits/credits.component';
import { WalletV2CreditsSummaryComponent } from './components/credits/summary/summary.component';
import { WalletV2CreditsHistoryComponent } from './components/credits/history/history.component';
import { WalletV2CreditsTransactionHistoryComponent } from './components/credits/history/transaction-history/transaction-history.component';
import { WalletV2CreditsSendComponent } from './components/credits/send/send.component';
import { WalletV2CreditsProductUpgradeCardComponent } from './components/credits/send/product-upgrade-card/product-upgrade-card.component';
import { MindsOnlyRedirectGuard } from '../../common/guards/minds-only-redirect.guard';
import { WalletBridgeComponent } from './components/tokens/bridge/bridge.component';

export const WALLET_ROUTES: Routes = [
  { path: 'canary', redirectTo: '..', pathMatch: 'full' as PathMatch },
  {
    path: '',
    pathMatch: 'prefix' as PathMatch,
    component: WalletDashboardComponent,
    canActivate: [MindsOnlyRedirectGuard],
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
            pathMatch: 'full' as PathMatch,
          },
          {
            path: 'overview',
            redirectTo: 'balance',
            pathMatch: 'full' as PathMatch,
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
          {
            path: 'bridge',
            component: WalletBridgeComponent,
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
            pathMatch: 'full' as PathMatch,
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
        path: 'credits',
        component: WalletV2CreditsComponent,
        children: [
          {
            path: '',
            redirectTo: 'history',
            pathMatch: 'full' as PathMatch,
          },
          {
            path: 'history/:giftCardGuid',
            component: WalletV2CreditsTransactionHistoryComponent,
          },
          {
            path: 'history',
            component: WalletV2CreditsHistoryComponent,
            canActivate: [TabStorageGuard],
          },
          {
            path: 'send',
            component: WalletV2CreditsSendComponent,
            canActivate: [TabStorageGuard],
          },
        ],
      },
      {
        path: '**', // redirected by RouterRedirectGuard
        canActivate: [DefaultRedirectGuard],
        children: [],
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
    NgOptimizedImage,
  ],
  declarations: [
    WalletDashboardComponent,
    WalletRewardsPopupComponent,
    WalletTransactionsTableComponent,
    WalletSettingsTokensComponent,
    WalletSettingsCashComponent,
    WalletSettingsBTCComponent,
    WalletModalComponent,
    WalletOnchainTransferComponent,
    WalletBalanceTokensV2Component,
    WalletBalanceCashComponent,
    WalletProEarningsCashComponent,
    WalletTransactionsTokensComponent,
    WalletTransactionsCashComponent,
    WalletCashOnboardingComponent,
    WalletCashOnboardingExtrasComponent,
    WalletCashBankFormComponent,
    WalletOnchainTransfersSummaryComponent,
    WalletBridgeComponent,
    // MH fixed:
    WalletV2TokensComponent,
    WalletV2CashComponent,
    // V3 wallet
    WalletBalanceComponent,
    WalletTokenRewardsComponent,
    WalletEarningsComponent,
    WalletTokensDropdownMenu,
    // Credits
    WalletV2CreditsComponent,
    WalletV2CreditsSummaryComponent,
    WalletV2CreditsHistoryComponent,
    WalletV2CreditsTransactionHistoryComponent,
    WalletV2CreditsSendComponent,
    WalletV2CreditsProductUpgradeCardComponent,
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
