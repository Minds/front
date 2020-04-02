import { Injectable } from '@angular/core';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { BTCComponent } from './btc.component';

@Injectable()
export class BTCService {
  constructor(private overlayModal: OverlayModalService) {}

  showModal(opts) {
    this.overlayModal.create(BTCComponent, opts).present();
  }
}
