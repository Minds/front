import { Injectable } from '@angular/core';
import { ModalService } from '../../../../../../../services/ux/modal.service';
import { NetworkBridgeTxHistoryModalComponent } from './network-bridge-tx-history.component';

@Injectable({ providedIn: 'root' })
export class NetworkBridgeTxHistoryService {
  constructor(private modalService: ModalService) {}

  async open(): Promise<any> {
    const modal = this.modalService.present(
      NetworkBridgeTxHistoryModalComponent,
      {
        data: {
          onDismissIntent: () => modal.close(),
        },
        modalDialogClass: 'modal-content--history',
      }
    );
  }
}
