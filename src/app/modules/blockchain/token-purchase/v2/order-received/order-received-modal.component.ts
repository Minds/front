import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OrderData } from './order-received-modal.service';

@Component({
  selector: 'm-orderReceived__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'order-received-modal.component.html',
  styleUrls: ['./order-received-modal.component.ng.scss'],
})
export class OrderReceivedModalComponent {
  orderData: OrderData;

  @Input('orderData') set data(orderData) {
    this.orderData = orderData;
  }
}
