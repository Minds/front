import { Injectable, Injector } from '@angular/core';
import { ModalRef, ModalService } from '../../../../services/ux/modal.service';
import { VerifyUniquenessModalComponent } from '../verify-uniqueness-modal.component';

type ModalComponent = typeof VerifyUniquenessModalComponent;

/**
 * Lazy loads boost modal.
 */
@Injectable({ providedIn: 'root' })
export class VerifyUniquenessModalLazyService {
  constructor(
    private modalService: ModalService,
    private injector: Injector
  ) {}

  /**
   * Lazy load modules and open modal.
   * @returns { Promise<ModalRef<PresentableBoostModalComponent>>} - awaitable.
   */
  public async open(): Promise<ModalRef<VerifyUniquenessModalComponent>> {
    const modal = this.modalService.present<any>(
      VerifyUniquenessModalComponent,
      {
        data: {
          onCloseIntent: () => modal.close(),
        },
      }
    );
    return modal;
  }
}
