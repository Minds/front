import { Injectable, Injector } from '@angular/core';
import { ModalService } from '../../../services/ux/modal.service';
import { NetworksCreateRootUserComponent } from './create-root-user.component';
import { Tenant } from '../../../../graphql/generated.engine';

/**
 * Service to present create network root user modal and handle its response
 */
@Injectable()
export class NetworksCreateRootUserModalService {
  constructor(
    protected modalService: ModalService,
    private injector: Injector
  ) {}

  /**
   * Presents the modal to create the network root user account
   */
  async present(network: Tenant): Promise<null> {
    const modal = this.modalService.present(NetworksCreateRootUserComponent, {
      data: {
        network: network,
        onSave: () => {
          modal.dismiss();
          // TODO SSO to network > admin panel > domain tab
        },
      },
      injector: this.injector,
      windowClass: 'm-modalV2__mobileFullCover',
    });

    return modal.result;
  }
}
