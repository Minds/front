import { Injectable } from '@angular/core';
import {
  StackableModalService,
  StackableModalEvent,
} from '../../../../services/ux/stackable-modal.service';
import { NetworkSwapBridgeModalComponent } from './network-swap-bridge-modal.component';

@Injectable({ providedIn: 'root' })
export class NetworkSwapBridgeService {
  constructor(private stackableModal: StackableModalService) {}

  /**
   * Open network swap bridge modal
   * @returns { StackableModalEvent }
   */
  public async open(): Promise<StackableModalEvent> {
    return this.stackableModal
      .present(NetworkSwapBridgeModalComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        onComplete: () => {
          this.stackableModal.dismiss();
        },
        onDismissIntent: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();
  }
}
