import { Injectable } from '@angular/core';
import { ModalService } from '../../../../../../../services/ux/modal.service';
import { NetworkBridgeTransferModalComponent } from './network-bridge-transfer.component';

@Injectable({ providedIn: 'root' })
export class NetworkBridgeSwapService {
  constructor(private modalService: ModalService) {}

  async open(entity = {}): Promise<any> {
    const modal = this.modalService.present(
      NetworkBridgeTransferModalComponent,
      {
        data: {
          entity: entity,
          onSaveIntent: () => modal.close(),
        },
        modalDialogClass: 'modal-content--swap',
      }
    );
  }
}
