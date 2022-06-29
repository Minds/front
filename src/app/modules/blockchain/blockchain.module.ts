import { NgModule, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../common/common.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionOverlayComponent } from './transaction-overlay/transaction-overlay.component';
import { TransactionOverlayService } from './transaction-overlay/transaction-overlay.service';
import { Web3WalletService } from './web3-wallet.service';
import { TokenContractService } from './contracts/token-contract.service';
import { BoostContractService } from './contracts/boost-contract.service';
import { WireContractService } from './contracts/wire-contract.service';
import { WithdrawContractService } from './contracts/withdraw-contract.service';
import { TokenDistributionEventService } from './contracts/token-distribution-event.service';
import { OffchainPaymentService } from './offchain-payment.service';
import { GetMetamaskComponent } from './metamask/getmetamask.component';
import { BlockchainEthModalComponent } from './eth-modal/eth-modal.component';
import { BlockchainMarketingOnboardComponent } from './token-purchase/onboard.component';
import { BlockchainPurchaseV2Component } from './token-purchase/v2/purchase/purchase.component';
import { SendWyreService } from './sendwyre/sendwyre.service';
import { ModalsModule } from '../modals/modals.module';
import { ConfigsService } from '../../common/services/configs.service';
import { Web3ModalModule, Web3ModalService } from '@mindsorg/web3modal-angular';
import { createWeb3ModalConfig } from '../../helpers/web3modal-configuration';
import { BuyTokensModalService } from './token-purchase/v2/buy-tokens-modal.service';
import { BuyTokensModalModule } from './token-purchase/v2/buy-tokens-modal.module';

const cryptoRoutes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild(cryptoRoutes),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalsModule,
    Web3ModalModule,
    BuyTokensModalModule,
  ],
  declarations: [
    TransactionOverlayComponent,
    GetMetamaskComponent,
    BlockchainEthModalComponent,
    BlockchainMarketingOnboardComponent,
    BlockchainPurchaseV2Component,
  ],
  providers: [
    TokenContractService,
    WireContractService,
    WithdrawContractService,
    BoostContractService,
    TokenDistributionEventService,
    OffchainPaymentService,
    SendWyreService,
    BuyTokensModalService,
  ],
  exports: [
    TransactionOverlayComponent,
    GetMetamaskComponent,
    BlockchainEthModalComponent,
    BlockchainPurchaseV2Component,
    Web3ModalModule,
  ],
})
export class BlockchainModule {}
