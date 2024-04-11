import { createNgModuleRef, Injectable, Injector } from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { AffiliatesShareModalOpts } from '../types/share-modal.types';
import { AffiliatesShareComponent } from '../components/share/share.component';

/**
 * Service for showing the affiliates share modal.
 */
@Injectable({ providedIn: 'root' })
export class AffiliatesShareModalService {
  constructor(
    private injector: Injector,
    private modal: ModalService
  ) {}

  /**
   * Presents the modal.
   * @param { AffiliatesShareModalOpts} opts - share modal options.
   * @returns { Promise<ModalRef<AffiliatesShareComponent>> }
   */
  public async open(
    opts: AffiliatesShareModalOpts = null
  ): Promise<ModalRef<AffiliatesShareComponent>> {
    return this.modal.present(AffiliatesShareComponent, {
      data: opts,
      injector: this.injector,
      size: 'smd',
    });
  }
}
