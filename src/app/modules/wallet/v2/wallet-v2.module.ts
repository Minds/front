import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../../common/common.module';

import { WalletDashboardComponent } from './dashboard.component';
import { WalletBalanceTokensV2Component } from './balance-tokens/balance-tokens.component';
import { WalletChartComponent } from './chart/chart.component';
import { WalletTransactionsTableComponent } from './transactions-table/transactions-table.component';
import { WalletRewardsPopupComponent } from './rewards-popup/rewards-popup.component';
import { WalletDashboardService } from './dashboard.service';
import { WalletSettingsTokensComponent } from './settings-tokens/settings-tokens.component';
import { WalletSettingsCashComponent } from './settings-cash/settings-cash.component';
import { WalletSettingsETHComponent } from './settings-eth/settings-eth.component';
import { WalletSettingsBTCComponent } from './settings-btc/settings-btc.component';
import { WalletTokenOnboardingComponent } from './token-onboarding/token-onboarding.component';
import { WalletModalComponent } from './modal/modal.component';
import { WalletPhoneVerificationComponent } from './phone-verification/phone-verification.component';
import { WalletOnchainTransferComponent } from './onchain-transfer/onchain-transfer.component';
import { WalletBalanceCashComponent } from './balance-cash/balance-cash.component';
import { WalletPendingCashPayoutComponent } from './pending-cash-payout/pending-cash-payout.component';
import { WalletTransactionsTokensComponent } from './transactions-tokens/transactions-tokens.component';
import { WalletTransactionsCashComponent } from './transactions-cash/transactions-cash.component';
import { WalletCashOnboardingComponent } from './settings-cash/cash-onboarding/cash-onboarding.component';
import { WalletCashOnboardingExtrasComponent } from './settings-cash/cash-onboarding-extras/cash-onboarding-extras.component';
import { WalletCashBankFormComponent } from './settings-cash/cash-bank-form/cash-bank-form.component';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { LocalWalletService } from '../../blockchain/local-wallet.service';
import { TransactionOverlayService } from '../../blockchain/transaction-overlay/transaction-overlay.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';
import { WithdrawContractService } from '../../blockchain/contracts/withdraw-contract.service';
import { AnalyticsModule } from '../../analytics/analytics.module';

//////////////////////////////////////////////////
// TODO add a wildcard and the parameter routes as children once feature-flag is lifted
export const WALLET_V2_ROUTES: Routes = [
  {
    path: 'wallet',
    component: WalletDashboardComponent,
    data: {
      title: 'Wallet',
      description: 'Manage all of your transactions and earnings on Minds',
      ogImage: '/assets/photos/graph.jpg',
    },
  },
  {
    path: 'wallet/:currency/:view',
    component: WalletDashboardComponent,
    data: {
      title: 'Wallet',
      description: 'Manage all of your transactions and earnings on Minds',
      ogImage: '/assets/photos/graph.jpg',
    },
  },
  {
    path: 'wallet/:currency',
    component: WalletDashboardComponent,
    data: {
      title: 'Wallet',
      description: 'Manage all of your transactions and earnings on Minds',
      ogImage: '/assets/photos/graph.jpg',
    },
  },
];
/////////////////////////////////////////////////

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    AnalyticsModule,
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
    WalletPendingCashPayoutComponent,
    WalletTransactionsTokensComponent,
    WalletTransactionsCashComponent,
    WalletCashOnboardingComponent,
    WalletCashOnboardingExtrasComponent,
    WalletCashBankFormComponent,
  ],
  exports: [WalletDashboardComponent],
  providers: [
    WalletDashboardService,
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
    ConfigsService,
  ],
})
export class WalletV2Module {}
