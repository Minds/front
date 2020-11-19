import { NgModule, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../common/common.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockchainWalletSelector } from './wallet-selector/wallet-selector.component';
import { BlockchainWalletAddressNoticeComponent } from './wallet-address-notice/wallet-address-notice.component';
import { TransactionOverlayComponent } from './transaction-overlay/transaction-overlay.component';
import { TransactionOverlayService } from './transaction-overlay/transaction-overlay.service';
import { Web3WalletService } from './web3-wallet.service';
import { TokenContractService } from './contracts/token-contract.service';
import { BoostContractService } from './contracts/boost-contract.service';
import { WireContractService } from './contracts/wire-contract.service';
import { WithdrawContractService } from './contracts/withdraw-contract.service';
import { TokenDistributionEventService } from './contracts/token-distribution-event.service';
import { LocalWalletService } from './local-wallet.service';
import { OffchainPaymentService } from './offchain-payment.service';
import { GetMetamaskComponent } from './metamask/getmetamask.component';
import { BlockchainEthModalComponent } from './eth-modal/eth-modal.component';
import { BlockchainMarketingOnboardComponent } from './token-purchase/onboard.component';
import { BlockchainPurchaseComponent } from './token-purchase/purchase.component';
import { SendWyreService } from './sendwyre/sendwyre.service';
import { ModalsModule } from '../modals/modals.module';
import { ConfigsService } from '../../common/services/configs.service';

const cryptoRoutes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild(cryptoRoutes),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalsModule,
  ],
  declarations: [
    BlockchainWalletSelector,
    BlockchainWalletAddressNoticeComponent,
    TransactionOverlayComponent,
    GetMetamaskComponent,
    BlockchainEthModalComponent,
    BlockchainMarketingOnboardComponent,
    BlockchainPurchaseComponent,
  ],
  providers: [
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
    SendWyreService,
  ],
  exports: [
    BlockchainWalletSelector,
    BlockchainWalletAddressNoticeComponent,
    TransactionOverlayComponent,
    GetMetamaskComponent,
    BlockchainEthModalComponent,
    BlockchainPurchaseComponent,
  ],
})
export class BlockchainModule {}
