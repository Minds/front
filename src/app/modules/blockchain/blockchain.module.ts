import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../common/common.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionOverlayComponent } from './transaction-overlay/transaction-overlay.component';
import { TokenContractService } from './contracts/token-contract.service';
import { BoostContractService } from './contracts/boost-contract.service';
import { WireContractService } from './contracts/wire-contract.service';
import { WithdrawContractService } from './contracts/withdraw-contract.service';
import { TokenDistributionEventService } from './contracts/token-distribution-event.service';
import { OffchainPaymentService } from './offchain-payment.service';
import { GetMetamaskComponent } from './metamask/getmetamask.component';
import { BlockchainEthModalComponent } from './eth-modal/eth-modal.component';
import { BlockchainMarketingOnboardComponent } from './token-purchase/onboard.component';
import { SendWyreService } from './sendwyre/sendwyre.service';
import { ModalsModule } from '../modals/modals.module';
import { Web3ModalModule } from '@mindsorg/web3modal-angular';

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
  ],
  declarations: [
    TransactionOverlayComponent,
    GetMetamaskComponent,
    BlockchainEthModalComponent,
    BlockchainMarketingOnboardComponent,
  ],
  providers: [
    TokenContractService,
    WireContractService,
    WithdrawContractService,
    BoostContractService,
    TokenDistributionEventService,
    OffchainPaymentService,
    SendWyreService,
  ],
  exports: [
    TransactionOverlayComponent,
    GetMetamaskComponent,
    BlockchainEthModalComponent,
    Web3ModalModule,
  ],
})
export class BlockchainModule {}
