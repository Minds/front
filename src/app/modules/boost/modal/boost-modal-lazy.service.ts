import { Injectable, Injector } from '@angular/core';
import { BoostModalComponent } from './boost-modal.component';
import { BoostableEntity } from './boost-modal.service';
import { ModalService } from '../../../services/ux/modal.service';

/**
 * Lazy loads boost modal.
 */
@Injectable({ providedIn: 'root' })
export class BoostModalLazyService {
  constructor(private modalService: ModalService, private injector: Injector) {}
  /**
   * Lazy load modules and open modal.
   * @param { BoostableEntity } entity - entity that can be boosted.
   * @returns { Promise<any> } - awaitable.
   */
  public async open(entity: BoostableEntity = {}): Promise<any> {
    const { BoostModalLazyModule } = await import('./boost-modal-lazy.module');
    const modal = this.modalService.present(BoostModalComponent, {
      data: {
        entity: entity,
        onSaveIntent: () => modal.close(),
      },
      size: 'lg',
      injector: this.injector,
      lazyModule: BoostModalLazyModule,
    });
  }
}
