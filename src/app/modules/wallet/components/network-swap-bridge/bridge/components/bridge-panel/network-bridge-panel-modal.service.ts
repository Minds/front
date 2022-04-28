import { Injectable } from '@angular/core';
import { ModalService } from '../../../../../../../services/ux/modal.service';

import { NetworkBridgePanelModalComponent } from './network-bridge-panel-modal.component';

@Injectable({ providedIn: 'root' })
export class NetworkBridgePanelModalService {
  constructor(private modalService: ModalService) {}

  async open(entity = {}): Promise<any> {
    const modal = this.modalService.present(NetworkBridgePanelModalComponent, {
      data: {
        entity: entity,
        onSaveIntent: () => modal.close(),
      },
      modalDialogClass: 'modal-content--bridge',
    });
  }
}
