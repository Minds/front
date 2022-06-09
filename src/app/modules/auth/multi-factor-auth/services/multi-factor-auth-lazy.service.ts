import { Injectable, Injector } from '@angular/core';
import { MultiFactorRootPanel } from './multi-factor-auth-service';
import { MultiFactorAuthBaseComponent } from '../multi-factor-auth.component';
import { MultiFactorAuthConfirmationService } from './multi-factor-auth-confirmation.service';
import { ModalRef, ModalService } from '../../../../services/ux/modal.service';

export type MultiFactorModalOpts = {
  authType: MultiFactorRootPanel;
};

/**
 * Lazy loads MFA modal.
 */
@Injectable({ providedIn: 'root' })
export class MultiFactorLazyService {
  modal?: ModalRef<any>;

  constructor(
    private modalService: ModalService,
    private injector: Injector,
    private multiFactorAuthConfirmation: MultiFactorAuthConfirmationService
  ) {}

  /**
   * Lazy load modules and open modal.
   * @param { MultiFactorModalOpts } opts
   * @returns { Promise<any> } - awaitable.
   */
  public async open(
    opts: MultiFactorModalOpts = { authType: 'totp' }
  ): Promise<void> {
    this.modal?.dismiss();

    const { MultiFactorAuthLazyModule } = await import(
      '../multi-factor-auth-lazy.module'
    );

    this.modal = this.modalService.present(MultiFactorAuthBaseComponent, {
      data: {
        ...opts,
        onSaveIntent: () => this.modal?.close(),
      },
      injector: this.injector,
      lazyModule: MultiFactorAuthLazyModule,
    });

    return this.modal.result;
  }

  /**
   * Returns whether the 2fa modal is open
   * @returns { bool }
   */
  public isOpen(): boolean {
    return this.modalService.isOpen(MultiFactorAuthBaseComponent);
  }

  /**
   * Observable for when the 2fa modal is dismissed
   * @returns { Observable<any> }
   */
  get dismissed() {
    return this.modal?.dismissed
  };

  /**
   * Call to dismiss modal.
   * @param { success?: boolean } params - success will call the success service.
   */
  public dismiss(params: { success?: boolean } = {}): void {
    this.modal?.dismiss();

    if (params.success) {
      this.multiFactorAuthConfirmation.success$.next(true);
    }
  }
}
