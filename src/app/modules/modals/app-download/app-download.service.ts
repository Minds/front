import { createNgModuleRef, Injectable, Injector } from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { AppDownloadModalComponent } from './app-download.component';
import { AppDownloadModalLazyModule } from './app-download-lazy.module';

type ModalComponent = typeof AppDownloadModalComponent;

/**
 * Lazy loads app download modal.
 */
@Injectable({ providedIn: 'root' })
export class AppDownloadModalLazyService {
  constructor(
    private modalService: ModalService,
    private injector: Injector
  ) {}

  /**
   * Lazy load modules and open modal.
   * @returns { Promise<ModalRef<AppDownloadModalComponent>>} - awaitable.
   */
  public async open(): Promise<ModalRef<AppDownloadModalComponent>> {
    const componentRef: ModalComponent = await this.getComponentRef();
    const modal = this.modalService.present<any>(componentRef, {
      data: {
        onCloseIntent: () => modal.close(),
        size: 'sm',
      },
    });
    return modal;
  }

  /**
   * Gets reference to component to load
   * @returns { Promise<ModalComponent> }
   */
  private async getComponentRef(): Promise<ModalComponent> {
    return createNgModuleRef<AppDownloadModalLazyModule>(
      (await import('./app-download-lazy.module')).AppDownloadModalLazyModule,
      this.injector
    ).instance.resolveComponent();
  }
}
