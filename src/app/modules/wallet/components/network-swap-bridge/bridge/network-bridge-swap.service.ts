import { Injectable } from '@angular/core';
import { ModalService } from '../../../../../services/ux/modal.service';
import { NetworkBridgeSwapModalComponent } from './network-bridge-swap.component';

@Injectable({ providedIn: 'root' })
export class NetworkBridgeSwapService {
  constructor(private modalService: ModalService) {}

  async open(entity = {}): Promise<any> {
    const modal = this.modalService.present(NetworkBridgeSwapModalComponent, {
      data: {
        entity: entity,
        onSaveIntent: () => modal.close(),
      },
      modalDialogClass: 'modal-content--swap',
    });
  }
}
