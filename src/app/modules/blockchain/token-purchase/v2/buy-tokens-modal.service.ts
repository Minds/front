import { Compiler, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
import { BuyTokensModalComponent } from './buy-tokens-modal.component';
import { ModalService } from '../../../../services/ux/modal.service';

@Injectable()
export class BuyTokensModalService {
  constructor(
    private modalService: ModalService,
    private compiler: Compiler,
    private injector: Injector,
    private authModalService: AuthModalService
  ) {}

  async open(): Promise<any> {
    await this.authModalService.open();
    const { BuyTokensModalModule } = await import('./buy-tokens-modal.module');
    const onSuccess$: Subject<any> = new Subject();
    const modal = this.modalService.present(BuyTokensModalComponent, {
      lazyModule: BuyTokensModalModule,
      injector: this.injector,
    });

    await modal.result;

    return onSuccess$.toPromise();
  }
}
