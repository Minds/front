import { Compiler, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import {
  StackableModalEvent,
  StackableModalService,
} from '../../../services/ux/stackable-modal.service';
import { ConnectWalletModalComponent } from './connect-wallet-modal.component';

@Injectable({ providedIn: 'root' })
export class ConnectWalletModalService {
  constructor(
    private stackableModal: StackableModalService,
    private compiler: Compiler,
    private injector: Injector
  ) {}

  async open(): Promise<string> {
    const { ConnectWalletModalModule } = await import(
      './connect-wallet-modal.module'
    );

    const moduleFactory = await this.compiler.compileModuleAsync(
      ConnectWalletModalModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    const componentFactory = moduleRef.instance.resolveComponent();

    const onSuccess$: Subject<string> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(ConnectWalletModalComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        onComplete: (address: string) => {
          onSuccess$.next(address);
          onSuccess$.complete(); // Ensures promise can be called below
          this.stackableModal.dismiss();
        },
        onDismissIntent: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();

    return await onSuccess$.toPromise();
  }
}
