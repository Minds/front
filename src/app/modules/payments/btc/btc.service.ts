import { Injectable } from '@angular/core';
import { BTCComponent } from './btc.component';
import { ModalService } from '../../../services/ux/modal.service';

@Injectable()
export class BTCService {
  constructor(private modalService: ModalService) {}

  showModal(opts: { amount: number; address: string }) {
    return this.modalService.present(BTCComponent, { data: opts, size: 'sm' });
  }
}
