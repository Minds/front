import { Injectable } from '@angular/core';
import { BoostModalComponent } from './boost-modal.component';
import {
  LazyLoadingService,
  ModalLazyLoadService,
} from '../../../common/services/modal-lazy-load.service';
import { BoostableEntity } from './boost-modal.service';

/**
 * Lazy loads boost modal.
 */
@Injectable({ providedIn: 'root' })
export class BoostModalLazyService implements LazyLoadingService {
  constructor(private lazyModal: ModalLazyLoadService) {}
  /**
   * Lazy load modules and open modal.
   * @param { BoostableEntity } entity - entity that can be boosted.
   * @returns { Promise<any> } - awaitable.
   */
  public async open(entity: BoostableEntity = {}): Promise<any> {
    const { BoostModalLazyModule } = await import('./boost-modal-lazy.module');
    this.lazyModal
      .setComponent(BoostModalComponent)
      .setLazyModule(BoostModalLazyModule)
      .setOpts({
        wrapperClass: 'm-modalV2__wrapper',
        entity: entity,
        onSaveIntent: () => {
          this.lazyModal.dismiss();
        },
        onDismissIntent: () => {
          this.lazyModal.dismiss();
        },
      })
      .open();
  }
}
