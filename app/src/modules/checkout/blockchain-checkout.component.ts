import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'm-checkout--blockchain',
  templateUrl: 'blockchain-checkout.component.html'
})
export class BlockchainCheckoutComponent {
  @Output('inputed') inputtedEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  setValue(wallet) {
    this.inputtedEventEmitter.emit(wallet);
  }
}
