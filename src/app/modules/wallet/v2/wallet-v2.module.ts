import { NgModule } from '@angular/core';
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

//////////////////////////////////////////////////
export const WALLET_V2_ROUTES: Routes = [
  {
    path: 'wallet',
    component: WalletDashboardComponent,
    data: {
      title: 'Wallet',
      description: 'Manage all of your transactions and earnings on Minds',
      ogImage: '/assets/photos/graph.jpg',
    },
    children: [
      { path: '', redirectTo: 'tokens/overview', pathMatch: 'full' },
      { path: ':currency/:view', component: WalletDashboardComponent },
      { path: ':currency', component: WalletDashboardComponent },
    ],
  },
];
// activatedRoute.routeConfig.children
/////////////////////////////////////////////////

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    // RouterModule.forChild(walletRoutes),
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
  ],
  exports: [WalletDashboardComponent],
  providers: [WalletDashboardService],
})
export class WalletV2Module {}
