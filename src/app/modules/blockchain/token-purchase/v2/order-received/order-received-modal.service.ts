import { Injectable } from '@angular/core';
import { OrderReceivedModalComponent } from './order-received-modal.component';
import { ModalService } from '../../../../../services/ux/modal.service';

export interface OrderData {
  paymentMethod: 'Card' | 'Bank';
  tokenAmount: number;
  paymentAmount: number;
  currency: string;
}

@Injectable()
export class OrderReceivedModalService {
  constructor(private modalService: ModalService) {}

  async open(orderData: OrderData): Promise<any> {
    return this.modalService.present(OrderReceivedModalComponent, {
      data: {
        orderData,
      },
    }).result;
  }
}
