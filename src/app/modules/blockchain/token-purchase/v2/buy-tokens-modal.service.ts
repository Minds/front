import { Injectable, Injector } from '@angular/core';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
import { BuyTokensModalComponent } from './buy-tokens-modal.component';
import { ModalService } from '../../../../services/ux/modal.service';

@Injectable()
export class BuyTokensModalService {
  constructor(
    private modalService: ModalService,
    private injector: Injector,
    private authModal: AuthModalService
  ) {}

  async open(): Promise<any> {
    const user = await this.authModal.open();
    if (user) {
      const { BuyTokensModalModule } = await import(
        './buy-tokens-modal.module'
      );
      const modal = this.modalService.present(BuyTokensModalComponent, {
        lazyModule: BuyTokensModalModule,
        injector: this.injector,
      });

      return modal.result;
    }
  }
}
