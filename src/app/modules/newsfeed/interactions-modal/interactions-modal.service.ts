import { Compiler, Injectable, Injector } from '@angular/core';
import {
  StackableModalEvent,
  StackableModalService,
} from '../../../services/ux/stackable-modal.service';
import { InteractionType } from './interactions-modal-data.service';
import { InteractionsModalComponent } from './interactions-modal.component';

@Injectable({ providedIn: 'root' })
export class InteractionsModalService {
  constructor(
    private stackableModal: StackableModalService,
    private compiler: Compiler,
    private injector: Injector
  ) {}

  async open(type: InteractionType, entityGuid: string): Promise<any> {
    const { InteractionsModalModule } = await import(
      './interactions-modal.module'
    );

    const moduleFactory = await this.compiler.compileModuleAsync(
      InteractionsModalModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    const componentFactory = moduleRef.instance.resolveComponent();

    const evt: StackableModalEvent = await this.stackableModal
      .present(
        InteractionsModalComponent,
        { type, entityGuid },
        {
          wrapperClass: 'm-modalV2__wrapper',
          onComplete: (result: any) => {
            this.stackableModal.dismiss();
          },
          onDismissIntent: () => {
            this.stackableModal.dismiss();
          },
        }
      )
      .toPromise();

    return evt;
  }
}
