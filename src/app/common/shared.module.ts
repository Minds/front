import { NgModule, PLATFORM_ID } from '@angular/core';
import { PageLayoutService } from './layout/page-layout.service';
import { FeaturesService } from '../services/features.service';
import { ConfigsService } from './services/configs.service';
import { AuthModalService } from '../modules/auth/modal/auth-modal.service';
import { Web3ModalModule, Web3ModalService } from '@dorgtech/web3modal-angular';
import { createWeb3ModalConfig } from '../helpers/web3modal-configuration';
import { LocalWalletService } from '../modules/blockchain/local-wallet.service';
import { TransactionOverlayService } from '../modules/blockchain/transaction-overlay/transaction-overlay.service';
import { Web3WalletService } from '../modules/blockchain/web3-wallet.service';

@NgModule({
  imports: [Web3ModalModule],
  providers: [
    ConfigsService,
    PageLayoutService,
    FeaturesService,
    AuthModalService,
    {
      provide: Web3ModalService,
      useFactory: () => {
        const config = createWeb3ModalConfig();

        return new Web3ModalService(config);
      },
    },
    {
      provide: Web3WalletService,
      useFactory: Web3WalletService._,
      deps: [
        LocalWalletService,
        TransactionOverlayService,
        PLATFORM_ID,
        ConfigsService,
        Web3ModalService,
      ],
    },
  ],
})
export class SharedModule {}
