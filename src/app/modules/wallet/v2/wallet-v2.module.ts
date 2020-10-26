import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../../common/common.module';

import { WalletDashboardComponent } from './dashboard.component';
import { WalletBalanceTokensV2Component } from './tokens/balance/balance-tokens.component';
import { WalletChartComponent } from './components/chart/chart.component';
import { WalletTransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { WalletRewardsPopupComponent } from './components/rewards-popup/rewards-popup.component';
import { WalletSettingsTokensComponent } from './tokens/settings/settings-tokens.component';
import { WalletSettingsCashComponent } from './cash/settings/settings-cash.component';
import { WalletSettingsETHComponent } from './eth/settings/settings-eth.component';
import { WalletSettingsBTCComponent } from './btc/settings/settings-btc.component';
import { WalletTokenOnboardingComponent } from './tokens/onboarding/token-onboarding.component';
import { WalletModalComponent } from './components/modal/modal.component';
import { WalletPhoneVerificationComponent } from './components/phone-verification/phone-verification.component';
import { WalletOnchainTransferComponent } from './components/onchain-transfer/onchain-transfer.component';
import { WalletBalanceCashComponent } from './cash/balance/balance-cash.component';
import { WalletPendingCashPayoutComponent } from './components/pending-cash-payout/pending-cash-payout.component';
import { WalletTransactionsTokensComponent } from './tokens/transactions/transactions-tokens.component';
import { WalletTransactionsCashComponent } from './cash/transactions/transactions-cash.component';
import { WalletCashOnboardingComponent } from './cash/settings/cash-onboarding/cash-onboarding.component';
import { WalletCashOnboardingExtrasComponent } from './cash/settings/cash-onboarding-extras/cash-onboarding-extras.component';
import { WalletCashBankFormComponent } from './cash/settings/cash-bank-form/cash-bank-form.component';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { LocalWalletService } from '../../blockchain/local-wallet.service';
import { TransactionOverlayService } from '../../blockchain/transaction-overlay/transaction-overlay.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';
import { WithdrawContractService } from '../../blockchain/contracts/withdraw-contract.service';
import { ChartV2Module } from '../../analytics/components/chart-v2/chart-v2.module';
import { WalletV2TokensComponent } from './tokens/tokens.component';
import { WalletV2CashComponent } from './cash/cash.component';
import { WalletV2EthComponent } from './eth/eth.component';
import { WalletV2BtcComponent } from './btc/btc.component';
import { WalletProEarningsCashComponent } from './cash/pro-earnings/pro-earnings.component';
import { WalletTabHistoryService } from './tab-history.service';
import { DefaultRedirectGuard } from './guards/default-redirect-guard.component';
import { TabStorageGuard } from './guards/tab-storage-guard.component';

export const WALLET_V2_ROUTES: Routes = [
  {
    path: 'canary',
    component: WalletDashboardComponent,
    data: {
      title: 'Wallet',
      description: 'Manage all of your transactions and earnings on Minds',
      ogImage: '/assets/photos/graph.jpg',
    },
    children: [
      {
        path: 'tokens',
        component: WalletV2TokensComponent,
        children: [
          {
            path: '',
            redirectTo: 'overview',
            pathMatch: 'full',
          },
          {
            path: 'overview',
            canActivate: [TabStorageGuard],
            component: WalletChartComponent,
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
        ],
      },
      {
        path: 'cash',
        component: WalletV2CashComponent,
        children: [
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
    RouterModule.forChild(WALLET_V2_ROUTES),
    ChartV2Module,
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
    WalletPhoneVerificationComponent,
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
    // MH fixed:
    WalletV2TokensComponent,
    WalletV2CashComponent,
    WalletV2EthComponent,
    WalletV2BtcComponent,
  ],
  exports: [
    WalletDashboardComponent,
    WalletPhoneVerificationComponent,
    WalletSettingsCashComponent,
  ],
  providers: [
    {
      provide: Web3WalletService,
      useFactory: Web3WalletService._,
      deps: [
        LocalWalletService,
        TransactionOverlayService,
        PLATFORM_ID,
        ConfigsService,
      ],
    },
    TokenContractService,
    WithdrawContractService,
    WalletTabHistoryService,
    DefaultRedirectGuard,
    TabStorageGuard,
  ],
})
export class WalletV2Module {}
