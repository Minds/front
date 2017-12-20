import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'm-checkout--blockchain',
  templateUrl: 'blockchain-checkout.component.html'
})
export class BlockchainCheckoutComponent {
  @Output('inputed') inputtedEventEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input('autoselect') autoselect: boolean = true;
  @Output() autoselectChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  setValue(wallet) {
    this.autoselect = false;
    this.autoselectChange.emit(false);
    this.inputtedEventEmitter.emit(wallet);
  }

  onAutoSelectChange(value: boolean) {
    this.autoselectChange.emit(value);
  }
}
