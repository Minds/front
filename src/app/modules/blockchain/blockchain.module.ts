import { NgModule, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../common/common.module';
import { FaqModule } from '../faq/faq.module';

import { WalletComponent } from '../wallet/wallet.component';
import { BlockchainConsoleComponent } from './console/console.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockchainWalletSelector } from './wallet-selector/wallet-selector.component';
import { BlockchainWalletAddressNoticeComponent } from './wallet-address-notice/wallet-address-notice.component';
import { TransactionOverlayComponent } from './transaction-overlay/transaction-overlay.component';
import { TransactionOverlayService } from './transaction-overlay/transaction-overlay.service';
import { BlockchainTdeBuyComponent } from './tde-buy/tde-buy.component';
import { Web3WalletService } from './web3-wallet.service';
import { TokenContractService } from './contracts/token-contract.service';
import { BoostContractService } from './contracts/boost-contract.service';
import { WireContractService } from './contracts/wire-contract.service';
import { WithdrawContractService } from './contracts/withdraw-contract.service';
import { TokenDistributionEventService } from './contracts/token-distribution-event.service';
import { LocalWalletService } from './local-wallet.service';
import { OffchainPaymentService } from './offchain-payment.service';
import { Client } from '../../services/api/client';
import { GetMetamaskComponent } from './metamask/getmetamask.component';
import { BlockchainEthModalComponent } from './eth-modal/eth-modal.component';
import { BlockchainMarketingOnboardComponent } from './token-purchase/onboard.component';
import { BlockchainPurchaseComponent } from './token-purchase/purchase.component';
import { ModalsModule } from '../modals/modals.module';
import { ConfigsService } from '../../common/services/configs.service';

const cryptoRoutes: Routes = [
  {
    path: 'wallet/crypto',
    component: WalletComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: BlockchainConsoleComponent },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(cryptoRoutes),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FaqModule,
    ModalsModule,
  ],
  declarations: [
    BlockchainConsoleComponent,
    BlockchainWalletSelector,
    BlockchainWalletAddressNoticeComponent,
    TransactionOverlayComponent,
    BlockchainTdeBuyComponent,
    GetMetamaskComponent,
    BlockchainEthModalComponent,
    BlockchainMarketingOnboardComponent,
    BlockchainPurchaseComponent,
  ],
  providers: [
    TransactionOverlayService,
    {
      provide: LocalWalletService,
      useFactory: LocalWalletService._,
      deps: [TransactionOverlayService],
    },
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
    WireContractService,
    WithdrawContractService,
    BoostContractService,
    TokenDistributionEventService,
    OffchainPaymentService,
  ],
  exports: [
    BlockchainWalletSelector,
    BlockchainWalletAddressNoticeComponent,
    TransactionOverlayComponent,
    BlockchainTdeBuyComponent,
    GetMetamaskComponent,
    BlockchainEthModalComponent,
    BlockchainPurchaseComponent,
  ],
  entryComponents: [BlockchainTdeBuyComponent],
})
export class BlockchainModule {}
