import { Injectable } from '@angular/core';
import { ModalService } from '../../../../../../../services/ux/modal.service';
import { NetworkBridgeTransferModalComponent } from './network-bridge-transfer.component';
import { Network } from '../../../../../../../common/services/network-switch-service';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import { BridgeStep } from '../../constants/constants.types';

@Injectable({ providedIn: 'root' })
export class NetworkBridgeSwapService {
  constructor(
    private modalService: ModalService,
    private readonly networkBridgeService: NetworkBridgeService
  ) {}

  async open(entity: Network): Promise<any> {
    const modal = this.modalService.present(
      NetworkBridgeTransferModalComponent,
      {
        data: {
          entity: entity,
          onSaveIntent: () => {
            this.networkBridgeService.currentStep$.next(BridgeStep.SWAP),
              modal.close();
          },
        },
        modalDialogClass: 'modal-content--swap',
      }
    );
  }
}
