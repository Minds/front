import { Injectable } from '@angular/core';
import { ModalService } from '../../../../services/ux/modal.service';

import { NetworkSwapBridgeModalComponent } from './network-swap-bridge-modal.component';

@Injectable({ providedIn: 'root' })
export class NetworkSwapBridgeService {
  constructor(private modalService: ModalService) {}

  async open(entity = {}): Promise<any> {
    const modal = this.modalService.present(NetworkSwapBridgeModalComponent, {
      data: {
        entity: entity,
        onSaveIntent: () => modal.close(),
      },
      modalDialogClass: 'modal-content--bridge',
    });
  }
}
