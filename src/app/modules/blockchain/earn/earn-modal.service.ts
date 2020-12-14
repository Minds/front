import { Compiler, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import {
  StackableModalEvent,
  StackableModalService,
} from '../../../services/ux/stackable-modal.service';
import { EarnModalComponent } from './earn-modal.component';

@Injectable()
export class EarnModalService {
  constructor(
    private stackableModal: StackableModalService,
    private compiler: Compiler,
    private injector: Injector
  ) {}

  async open(): Promise<any> {
    const { EarnModalModule } = await import('./earn-modal.module');

    const moduleFactory = await this.compiler.compileModuleAsync(
      EarnModalModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    const componentFactory = moduleRef.instance.resolveComponent();

    const onSuccess$: Subject<any> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(EarnModalComponent, null, {
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
