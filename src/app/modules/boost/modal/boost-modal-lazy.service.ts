import { Injectable } from '@angular/core';
import { BoostModalComponent } from './boost-modal.component';
import {
  LazyLoadingService,
  ModalLazyLoadService,
} from '../../../common/services/modal-lazy-load.service';

export type BoostSubject = 'channel' | 'post' | '';

@Injectable({ providedIn: 'root' })
export class BoostModalLazyService implements LazyLoadingService {
  constructor(private lazyModal: ModalLazyLoadService) {}
  /**
   * Lazy load modules and open modal.
   * @returns { Promise<any> }
   */
  public async open(subject: BoostSubject = ''): Promise<any> {
    const { BoostModalLazyModule } = await import('./boost-modal-lazy.module');
    this.lazyModal
      .setComponent(BoostModalComponent)
      .setLazyModule(BoostModalLazyModule)
      .setOpts({
        wrapperClass: 'm-modalV2__wrapper',
        subject: subject,
        onSaveIntent: () => {
          console.log('save');
        },
        onDismissIntent: () => {
          console.log('dismissed');
          // this.dismiss();
        },
      })
      .open();
  }
}
