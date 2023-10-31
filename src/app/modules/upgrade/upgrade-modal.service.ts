import { Injectable, Injector, createNgModuleRef } from '@angular/core';
import { ModalRef, ModalService } from '../../services/ux/modal.service';
import { UpgradePageComponent } from './upgrade-page/upgrade-page.component';

/**
 * Service that lazy loads and presents
 * the upgrade page component as a modal
 */
@Injectable({ providedIn: 'root' })
export class UpgradeModalService {
  constructor(
    protected modalService: ModalService,
    private injector: Injector
  ) {}

  /**
   * Presents the modal.
   * @returns { Promise<ModalRef<UpgradePageComponentt>> }
   */
  public async open(): Promise<ModalRef<UpgradePageComponent>> {
    const { UpgradeModule } = await import('./upgrade.module');

    const moduleRef = createNgModuleRef(UpgradeModule, this.injector);

    const lazyUpgradePageComponent = moduleRef.instance.resolveComponent();

    const modal = this.modalService.present(lazyUpgradePageComponent, {
      data: {
        isModal: true,
        onWireModalDismissIntent: () => {
          this.dismiss();
        },
        onUpgradeComplete: () => {
          this.dismiss();
        },
      },
      injector: this.injector,
      size: 'lg',
      windowClass: 'm-modalV2__mobileFullCover',
    });

    return modal;
  }

  /**
   * Dismisses the modal
   */
  dismiss() {
    this.modalService.dismissAll();
  }
}
