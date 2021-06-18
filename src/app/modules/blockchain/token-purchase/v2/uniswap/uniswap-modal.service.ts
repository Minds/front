import { Compiler, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import {
  StackableModalEvent,
  StackableModalService,
} from '../../../../../services/ux/stackable-modal.service';
import { UniswapModalComponent } from './uniswap-modal.component';

export type UniswapAction = 'swap' | 'add';

@Injectable()
export class UniswapModalService {
  constructor(
    private stackableModal: StackableModalService,
    private compiler: Compiler,
    private injector: Injector
  ) {}

  async open(action: UniswapAction = 'swap'): Promise<any> {
    const { UniswapModalModule } = await import('./uniswap-modal.module');

    const moduleFactory = await this.compiler.compileModuleAsync(
      UniswapModalModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    const componentFactory = moduleRef.instance.resolveComponent();

    const onSuccess$: Subject<any> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(UniswapModalComponent, action, {
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
