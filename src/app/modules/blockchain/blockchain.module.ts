import { NgModule } from '@angular/core';
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
import { MarketingModule } from '../marketing/marketing.module';
import { BlockchainMarketingModule } from './marketing/marketing.module';

const cryptoRoutes: Routes = [
  {
    path: 'wallet/crypto',
    component: WalletComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: BlockchainConsoleComponent }
    ]
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
    //    BlockchainMarketingModule,
  ],
  declarations: [
    BlockchainConsoleComponent,
    BlockchainWalletSelector,
    BlockchainWalletAddressNoticeComponent,
    TransactionOverlayComponent,
    BlockchainTdeBuyComponent,
  ],
  providers: [
    TransactionOverlayService,
    {
      provide: LocalWalletService,
      useFactory: LocalWalletService._,
      deps: [ TransactionOverlayService ]
    },
    {
      provide: Web3WalletService,
      useFactory: Web3WalletService._,
      deps: [ LocalWalletService, TransactionOverlayService ]
    },
    {
      provide: TokenContractService,
      useFactory: TokenContractService._,
      deps: [ Web3WalletService, TransactionOverlayService ]
    },
    {
      provide: WireContractService,
      useFactory: WireContractService._,
      deps: [ Web3WalletService, TokenContractService ]
    },
    {
      provide: WithdrawContractService,
      useFactory: WithdrawContractService._,
      deps: [ Web3WalletService ]
    },
    {
      provide: BoostContractService,
      useFactory: BoostContractService._,
      deps: [ Web3WalletService, TokenContractService ]
    },
    {
      provide: TokenDistributionEventService,
      useFactory: TokenDistributionEventService._,
      deps: [ Web3WalletService ]
    },
    {
      provide: OffchainPaymentService,
      useFactory: OffchainPaymentService._,
      deps: [ Client ]
    }
  ],
  exports: [
    BlockchainWalletSelector,
    BlockchainWalletAddressNoticeComponent,
    TransactionOverlayComponent,
    BlockchainTdeBuyComponent
  ],
  entryComponents: [
    BlockchainTdeBuyComponent,
  ]
})
export class BlockchainModule { }
