import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'm-checkout--blockchain',
  templateUrl: 'blockchain-checkout.component.html'
})
export class BlockchainCheckoutComponent {
  @Input() autoselect: boolean = true;
  @Input() allowOffchain: boolean = false;

  @Output('inputed') inputtedEventEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output('autoselectChange') autoselectChangeEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  setValue(wallet) {
    this.autoselect = false;
    this.autoselectChangeEmitter.emit(false);
    this.inputtedEventEmitter.emit(wallet);
  }

  onAutoSelectChange(value: boolean) {
    this.autoselectChangeEmitter.emit(value);
  }
}
