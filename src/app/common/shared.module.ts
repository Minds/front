import { NgModule, PLATFORM_ID } from '@angular/core';
import { PageLayoutService } from './layout/page-layout.service';
import { ConfigsService } from './services/configs.service';
import { Web3ModalModule, Web3ModalService } from '@mindsorg/web3modal-angular';
import { createWeb3ModalConfig } from '../helpers/web3modal-configuration';
import { TransactionOverlayService } from '../modules/blockchain/transaction-overlay/transaction-overlay.service';
import { Web3WalletService } from '../modules/blockchain/web3-wallet.service';
import { UniswapModalService } from '../modules/blockchain/token-purchase/uniswap/uniswap-modal.service';
import { ToasterService } from './services/toaster.service';
import { ResetPasswordModalService } from '../modules/auth/reset-password-modal/reset-password-modal.service';
import { PermissionsService } from './services/permissions.service';
import { ExperimentsService } from '../modules/experiments/experiments.service';
import { TopbarService } from './layout/topbar.service';
import { IS_TENANT_NETWORK } from './injection-tokens/tenant-injection-tokens';
import { isPlatformBrowser } from '@angular/common';

@NgModule({
  imports: [Web3ModalModule],
  providers: [
    ConfigsService,
    PageLayoutService,
    UniswapModalService,
    ResetPasswordModalService,
    {
      provide: Web3ModalService,
      useFactory: (platformId: Object) => {
        if (isPlatformBrowser(platformId)) {
          const config = createWeb3ModalConfig();

          return new Web3ModalService(config);
        }
      },
      deps: [PLATFORM_ID],
    },
    {
      provide: Web3WalletService,
      useFactory: Web3WalletService._,
      deps: [
        TransactionOverlayService,
        PLATFORM_ID,
        ConfigsService,
        Web3ModalService,
        ToasterService,
      ],
    },
    {
      provide: PermissionsService,
      useFactory: (configsService, isTenantNetwork): PermissionsService =>
        new PermissionsService(configsService, isTenantNetwork),
      deps: [ConfigsService, IS_TENANT_NETWORK],
    },
    {
      provide: TopbarService,
      useFactory: (): TopbarService => new TopbarService(),
      deps: [ExperimentsService, ConfigsService],
    },
  ],
})
export class SharedModule {}
