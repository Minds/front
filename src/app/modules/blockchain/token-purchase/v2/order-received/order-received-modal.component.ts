import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OrderData } from './order-received-modal.service';

/**
 * Lets user know that tokenn order was received and it may take some time to be processed
 */
@Component({
  selector: 'm-orderReceived__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'order-received-modal.component.html',
  styleUrls: ['./order-received-modal.component.ng.scss'],
})
export class OrderReceivedModalComponent {
  orderData: OrderData;

  setModalData({ orderData }) {
    this.orderData = orderData;
  }
}
