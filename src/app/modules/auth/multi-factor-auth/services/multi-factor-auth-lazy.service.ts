import { Injectable } from '@angular/core';
import {
  LazyLoadingService,
  ModalLazyLoadService,
} from '../../../../common/services/modal-lazy-load.service';
import { MultiFactorRootPanel } from './multi-factor-auth-service';
import { MultiFactorAuthBaseComponent } from '../multi-factor-auth.component';
import { MultiFactorAuthConfirmationService } from './multi-factor-auth-confirmation.service';

export type MultiFactorModalOpts = {
  authType: MultiFactorRootPanel;
};

/**
 * Lazy loads MFA modal.
 */
@Injectable({ providedIn: 'root' })
export class MultiFactorLazyService implements LazyLoadingService {
  constructor(
    private lazyModal: ModalLazyLoadService,
    private multiFactorAuthConfirmation: MultiFactorAuthConfirmationService
  ) {}

  /**
   * Lazy load modules and open modal.
   * @param { MultiFactorAuthType } - totp or sms.
   * @returns { Promise<any> } - awaitable.
   */
  public async open(
    opts: MultiFactorModalOpts = { authType: 'totp' }
  ): Promise<void> {
    const { MultiFactorAuthLazyModule } = await import(
      '../multi-factor-auth-lazy.module'
    );

    try {
      await this.lazyModal
        .setComponent(MultiFactorAuthBaseComponent)
        .setLazyModule(MultiFactorAuthLazyModule)
        .setOpts({
          wrapperClass: 'm-modalV2__wrapper',
          ...opts,
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
        return;
      }
    }
  }

  /**
   * Call to dismiss modal.
   * @param { success?: boolean } params - success will call the success service.
   */
  public dismiss(params: { success?: boolean } = {}): void {
    this.lazyModal.dismiss();

    if (params.success) {
      this.multiFactorAuthConfirmation.success$.next(true);
    }
  }
}
