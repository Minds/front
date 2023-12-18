import { Injectable, Injector } from '@angular/core';
import { ModalService } from '../../../services/ux/modal.service';
import { NetworksCreateRootUserComponent } from './create-root-user.component';
import { Tenant } from '../../../../graphql/generated.engine';
import { AutoLoginService } from '../auto-login.service';

export enum CreateRootUserEventType {
  Completed = 1,
  Cancelled,
}

export interface CreateRootUserEvent {
  type: CreateRootUserEventType;
}

/**
 * Service to present create network root user modal and handle its response
 */
@Injectable()
export class NetworksCreateRootUserModalService {
  constructor(
    protected modalService: ModalService,
    private autoLoginService: AutoLoginService,
    private injector: Injector
  ) {}

  /**
   * Presents the modal to create the network root user account
   */
  public async present(network: Tenant): Promise<CreateRootUserEvent | null> {
    const modal = this.modalService.present(NetworksCreateRootUserComponent, {
      data: {
        network: network,
        onSave: () => {
          this.autoLoginService.login(network.id);
          modal.close({
            type: CreateRootUserEventType.Completed,
          });
        },
      },
      injector: this.injector,
      windowClass: 'm-modalV2__mobileFullCover',
    });

    const result = await modal.result;
    if (!result) {
      return {
        type: CreateRootUserEventType.Cancelled,
      };
    }
    return result;
  }

  /**
   * Dismisses the modal
   */
  public dismiss() {
    this.modalService.dismissAll();
  }
}
