import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'm-btc',
  templateUrl: 'btc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BTCComponent {
  address: string = '1DWPuJjcZWzsRPCwss4gYqgeUpkj5AD1yu';
  amount: string = '0.01';

  setModalData(data: { address: string; amount: number }) {
    this.address = data.address;
    this.amount = String(data.amount);
  }

  get qrdata() {
    return 'bitcoin:' + this.address + '?amount=' + this.amount;
  }
}
