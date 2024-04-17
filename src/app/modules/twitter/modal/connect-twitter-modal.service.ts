import { createNgModuleRef, Injectable, Injector } from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { ConnectTwitterModalComponent } from './connect-twitter-modal.component';
import { ConnectTwitterModalOpts } from './connect-twitter-modal.types';

/**
 * Service for showing the connect twitter modal.
 */
@Injectable({ providedIn: 'root' })
export class ConnectTwitterModalService {
  constructor(
    private injector: Injector,
    private modal: ModalService
  ) {}

  /**
   * Presents the modal.
   * @param { ConnectTwitterModalOpts } opts - connect twitter modal options.
   * @returns { Promise<ModalRef<ConnectTwitterModalComponent>> }
   */
  public async open(
    opts: ConnectTwitterModalOpts = null
  ): Promise<ModalRef<ConnectTwitterModalComponent>> {
    const { ConnectTwitterModalModule } = await import(
      './connect-twitter-modal.module'
    );
    const moduleRef = createNgModuleRef(
      ConnectTwitterModalModule,
      this.injector
    );
    const lazyConnectTwitterModalComponent =
      moduleRef.instance.resolveComponent();

    return this.modal.present(lazyConnectTwitterModalComponent, {
      data: opts,
      injector: this.injector,
      size: 'md',
      windowClass: 'm-modalV2__mobileFullCover',
    });
  }
}
