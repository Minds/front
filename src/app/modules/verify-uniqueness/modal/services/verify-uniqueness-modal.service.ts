import { createNgModuleRef, Injectable, Injector } from '@angular/core';
import { ModalRef, ModalService } from '../../../../services/ux/modal.service';
import { VerifyUniquenessModalComponent } from '../verify-uniqueness-modal.component';
import { VerifyUniquenessModalLazyModule } from '../verify-uniqueness-modal-lazy.module';

type ModalComponent = typeof VerifyUniquenessModalComponent;

/**
 * Lazy loads boost modal.
 */
@Injectable({ providedIn: 'root' })
export class VerifyUniquenessModalLazyService {
  constructor(private modalService: ModalService, private injector: Injector) {}

  /**
   * Lazy load modules and open modal.
   * @returns { Promise<ModalRef<PresentableBoostModalComponent>>} - awaitable.
   */
  public async open(): Promise<ModalRef<VerifyUniquenessModalComponent>> {
    const componentRef: ModalComponent = await this.getComponentRef();
    const modal = this.modalService.present<any>(componentRef, {
      data: {
        onCloseIntent: () => modal.close(),
      },
    });
    return modal;
  }

  /**
   * Gets reference to component to load
   * @returns { Promise<ModalComponent> }
   */
  private async getComponentRef(): Promise<ModalComponent> {
    return createNgModuleRef<VerifyUniquenessModalLazyModule>(
      (await import('../verify-uniqueness-modal-lazy.module'))
        .VerifyUniquenessModalLazyModule,
      this.injector
    ).instance.resolveComponent();
  }
}
