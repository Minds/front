import { Injectable, Injector } from '@angular/core';
import { UniswapModalComponent } from './uniswap-modal.component';
import { ModalService } from '../../../../../services/ux/modal.service';

export type UniswapAction = 'swap' | 'add';

@Injectable()
export class UniswapModalService {
  constructor(private modalService: ModalService, private injector: Injector) {}

  async open(action: UniswapAction = 'swap'): Promise<any> {
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
