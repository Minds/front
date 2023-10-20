import { Injectable, Injector } from '@angular/core';
import { ModalService } from '../../../services/ux/modal.service';
import { NetworksCreateAdminComponent } from './create-admin.component';

/**
 * Service to present create network admin modal and handle its response
 */
@Injectable()
export class NetworksCreateAdminModalService {
  constructor(
    protected modalService: ModalService,
    private injector: Injector
  ) {}

  /**
   * Presents the modal to create the network admin account
   */
  async present(networkId: string): Promise<null> {
    const modal = this.modalService.present(NetworksCreateAdminComponent, {
      data: {
        onSave: () => {
          modal.dismiss();
          // ojm SSO and go to network using networkId?
        },
      },
      injector: this.injector,
      windowClass: 'm-modalV2__mobileFullCover',
    });

    return modal.result;
  }
}
