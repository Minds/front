import { Injectable } from '@angular/core';
import {
  LazyLoadingService,
  ModalLazyLoadService,
} from '../../../../common/services/modal-lazy-load.service';
import { MultiFactorRootPanel } from './multi-factor-auth-service';
import { MultiFactorAuthBaseComponent } from './multi-factor-auth.component';

/**
 * Lazy loads MFA modal.
 */
@Injectable({ providedIn: 'root' })
export class MultiFactorLazyService implements LazyLoadingService {
  constructor(private lazyModal: ModalLazyLoadService) {}

  /**
   * Lazy load modules and open modal.
   * @param { MultiFactorAuthType } - totp or sms.
   * @returns { Promise<any> } - awaitable.
   */
  public async open(type: MultiFactorRootPanel = 'totp'): Promise<any> {
    const { MultiFactorAuthLazyModule } = await import(
      './multi-factor-auth-lazy.module'
    );
    try {
      await this.lazyModal
        .setComponent(MultiFactorAuthBaseComponent)
        .setLazyModule(MultiFactorAuthLazyModule)
        .setOpts({
          wrapperClass: 'm-modalV2__wrapper',
          authType: type,
          onSaveIntent: () => {
            this.lazyModal.dismiss();
          },
          onDismissIntent: () => {
            this.lazyModal.dismiss();
          },
        })
        .open();
    } catch (e) {
      if (e === 'DismissedModalException') {
        return; // do nothing
      }
      console.error(e);
    }
  }
}
