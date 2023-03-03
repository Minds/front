import { Injectable, Injector } from '@angular/core';
import { UniswapModalComponent } from './uniswap-modal.component';
import { ModalService } from '../../../../services/ux/modal.service';
import { Web3WalletService } from '../../web3-wallet.service';

export type UniswapAction = 'swap' | 'add';

@Injectable()
export class UniswapModalService {
  constructor(
    private modalService: ModalService,
    private injector: Injector,
    private web3Wallet: Web3WalletService
  ) {}

  async open(action: UniswapAction = 'swap'): Promise<any> {
    if (!this.web3Wallet.checkDeviceIsSupported()) {
      return null;
    }

    const { UniswapModalModule } = await import('./uniswap-modal.module');

    return this.modalService.present(UniswapModalComponent, {
      data: {
        action,
      },
      injector: this.injector,
      animation: false,
      lazyModule: UniswapModalModule,
    }).result;
  }
}
