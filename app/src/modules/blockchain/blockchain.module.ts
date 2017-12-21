import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../common/common.module';

import { WalletComponent } from '../wallet/wallet.component';
import { BlockchainConsoleComponent } from './console/console.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockchainWalletSelector } from './wallet-selector/wallet-selector.component';
import { BlockchainWalletAddressNoticeComponent } from './wallet-address-notice/wallet-address-notice.component';
import { TransactionOverlayComponent } from './transaction-overlay/transaction-overlay.component';
import { TransactionOverlayService } from './transaction-overlay/transaction-overlay.service';
import { Web3WalletService } from './web3-wallet.service';
import { TokenContractService } from './contracts/token-contract.service';
import { BoostContractService } from './contracts/boost-contract.service';
import { WireContractService } from './contracts/wire-contract.service';

const cryptoRoutes: Routes = [
  {
    path: 'wallet/crypto',
    component: WalletComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: BlockchainConsoleComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(cryptoRoutes),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    BlockchainConsoleComponent,
    BlockchainWalletSelector,
    BlockchainWalletAddressNoticeComponent,
    TransactionOverlayComponent,
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
      deps: [ Web3WalletService ]
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
  ],
  exports: [
    BlockchainWalletSelector,
    BlockchainWalletAddressNoticeComponent,
    TransactionOverlayComponent,
  ],
  entryComponents: []
})
export class BlockchainModule { }
