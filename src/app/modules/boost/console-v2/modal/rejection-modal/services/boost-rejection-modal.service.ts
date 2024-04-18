import { createNgModuleRef, Injectable, Injector } from '@angular/core';
import {
  ModalRef,
  ModalService,
} from '../../../../../../services/ux/modal.service';
import { BoostRejectionModalLazyModule } from '../boost-rejection-modal-lazy.module';
import { BoostRejectionModalComponent } from '../boost-rejection-modal.component';
import { Boost } from '../../../../boost.types';

type ModalComponent = typeof BoostRejectionModalComponent;

/**
 * Lazy loads boost modal.
 */
@Injectable({ providedIn: 'root' })
export class BoostRejectionModalService {
  constructor(
    private modalService: ModalService,
    private injector: Injector
  ) {}

  /**
   * Lazy load modules and open modal.
   * @returns { Promise<ModalRef<BoostRejectionModalComponent>>} - awaitable.
   */
  public async open(
    boost: Boost
  ): Promise<ModalRef<BoostRejectionModalComponent>> {
    const componentRef: ModalComponent = await this.getComponentRef();
    const modal = this.modalService.present<any>(componentRef, {
      data: {
        onCloseIntent: () => modal.close(),
        boost: boost,
      },
    });
    return modal;
  }

  /**
   * Gets reference to component to load
   * @returns { Promise<ModalComponent> }
   */
  private async getComponentRef(): Promise<ModalComponent> {
    return createNgModuleRef<BoostRejectionModalLazyModule>(
      (await import('../boost-rejection-modal-lazy.module'))
        .BoostRejectionModalLazyModule,
      this.injector
    ).instance.resolveComponent();
  }
}
