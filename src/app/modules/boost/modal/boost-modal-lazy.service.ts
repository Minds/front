import { createNgModuleRef, Injectable, Injector } from '@angular/core';
import { ModalService } from '../../../services/ux/modal.service';
import { BoostableEntity } from './boost-modal.types';

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
    const moduleRef = createNgModuleRef(BoostModalLazyModule, this.injector);
    const lazyBoostModalComponent = moduleRef.instance.resolveComponent();

    const modal = this.modalService.present(lazyBoostModalComponent, {
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
