import { Compiler, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import {
  StackableModalEvent,
  StackableModalService,
} from '../../../../services/ux/stackable-modal.service';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
import { BuyTokensModalComponent } from './buy-tokens-modal.component';

@Injectable()
export class BuyTokensModalService {
  constructor(
    private stackableModal: StackableModalService,
    private compiler: Compiler,
    private injector: Injector,
    private authModalService: AuthModalService
  ) {}

  async open(): Promise<any> {
    await this.authModalService.open();

    const { BuyTokensModalModule } = await import('./buy-tokens-modal.module');

    const moduleFactory = await this.compiler.compileModuleAsync(
      BuyTokensModalModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    const buyTokensComponentFactory = moduleRef.instance.resolveBuyTokensComponent();
    const orderReceivedComponentFactory = moduleRef.instance.resolveOrderReceivedComponent();

    const onSuccess$: Subject<any> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(BuyTokensModalComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        onComplete: (result: any) => {
          onSuccess$.next(result);
          onSuccess$.complete(); // Ensures promise can be called below
          this.stackableModal.dismiss();
        },
        onDismissIntent: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();

    return onSuccess$.toPromise();
  }
}
