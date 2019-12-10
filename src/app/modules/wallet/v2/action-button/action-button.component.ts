import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-walletActionButton',
  templateUrl: './action-button.component.html',
})
export class WalletActionButtonComponent {
  @Input() disabled: boolean = false;
  constructor() {}
}
