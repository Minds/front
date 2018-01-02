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
import { BlockchainMarketingComponent } from './marketing/marketing.component';
import { BlockchainTdeBuyComponent } from './tde-buy/tde-buy.component';
import { BlockchainPreRegisterComponent } from './pre-register/pre-register.component';
import { Web3WalletService } from './web3-wallet.service';
import { TokenContractService } from './contracts/token-contract.service';
import { BoostContractService } from './contracts/boost-contract.service';
import { WireContractService } from './contracts/wire-contract.service';
import { TokenDistributionEventService } from './contracts/token-distribution-event.service';

const cryptoRoutes: Routes = [
  {
    path: 'wallet/crypto',
    component: WalletComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: BlockchainConsoleComponent }
    ]
  },
  {
    path: 'token',
    component: BlockchainMarketingComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(cryptoRoutes),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FaqModule,
  ],
  declarations: [
    BlockchainConsoleComponent,
    BlockchainWalletSelector,
    BlockchainWalletAddressNoticeComponent,
    TransactionOverlayComponent,
    BlockchainMarketingComponent,
    BlockchainTdeBuyComponent,
    BlockchainPreRegisterComponent,
  ],
  providers: [
    TransactionOverlayService,
    {
      provide: Web3WalletService,
      useFactory: Web3WalletService._
    },
    {
      provide: TokenContractService,
      useFactory: TokenContractService._,
      deps: [ Web3WalletService, TransactionOverlayService ]
    },
    {
      provide: WireContractService,
      useFactory: WireContractService._,
      deps: [ Web3WalletService, TokenContractService, TransactionOverlayService ]
    },
    {
      provide: BoostContractService,
      useFactory: BoostContractService._,
      deps: [ Web3WalletService, TokenContractService, TransactionOverlayService ]
    },
    {
      provide: TokenDistributionEventService,
      useFactory: TokenDistributionEventService._,
      deps: [ Web3WalletService ]
    }
  ],
  exports: [
    BlockchainWalletSelector,
    BlockchainWalletAddressNoticeComponent,
    TransactionOverlayComponent,
    BlockchainTdeBuyComponent
  ],
  entryComponents: [
    BlockchainPreRegisterComponent,
    BlockchainTdeBuyComponent,
  ]
})
export class BlockchainModule { }
