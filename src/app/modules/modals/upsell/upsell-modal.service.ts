import { Injectable, Injector, createNgModuleRef } from '@angular/core';
import { ModalService } from '../../../services/ux/modal.service';
import { ModalRef } from '../../../services/ux/modal.service';
import { UpsellModalComponent } from './upsell-modal/upsell-modal.component';
import { Router } from '@angular/router';

/**
 * Service that lazy loads and presents
 * the upsell modal component
 */
@Injectable({ providedIn: 'root' })
export class UpsellModalService {
  constructor(
    private injector: Injector,
    private modalService: ModalService,
    private router: Router
  ) {}

  /**
   * Presents the modal.
   * @returns { Promise<ModalRef<UpsellModalComponent>> }
   */
  public async open(): Promise<ModalRef<UpsellModalComponent>> {
    const { UpsellModalModule } = await import('./upsell-modal.module');

    const moduleRef = createNgModuleRef(UpsellModalModule, this.injector);

    const lazyUpsellModalComponent = moduleRef.instance.resolveComponent();

    const modal = this.modalService.present(lazyUpsellModalComponent, {
      data: {
        onWireModalDismissIntent: () => {
          this.dismiss();
        },
        onUpgradeComplete: () => {
          this.dismiss();
          this.router.navigate(['/discovery/plus']);
        },
      },
      injector: this.injector,
      size: 'md',
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
