import { Injectable, Injector } from '@angular/core';
import { InteractionType } from './interactions-modal-data.service';
import { InteractionsModalComponent } from './interactions-modal.component';
import { ModalService } from '../../../services/ux/modal.service';

@Injectable({ providedIn: 'root' })
export class InteractionsModalService {
  constructor(
    private modalService: ModalService,
    private injector: Injector
  ) {}

  async open(type: InteractionType, entityGuid: string): Promise<any> {
    const { InteractionsModalModule } = await import(
      './interactions-modal.module'
    );

    const modal = this.modalService.present(InteractionsModalComponent, {
      data: {
        type,
        entityGuid,
      },
      injector: this.injector,
      lazyModule: InteractionsModalModule,
    });

    return modal.result;
  }
}
