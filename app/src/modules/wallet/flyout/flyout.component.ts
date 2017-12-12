import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'm-wallet--flyout',
  templateUrl: 'flyout.component.html'
})

export class WalletFlyoutComponent {
  @Input() address: string;
  @Input() balance: any;
  @Input() item: any;

  @Output('close') closeEvt: EventEmitter<any> = new EventEmitter();

  showAnnouncement = true;

  constructor(private router: Router) {

  }

  setUpCryptoWallet() {
    this.router.navigate(['/wallet/crypto/overview', { auto: 1 }]);
    this.address = void 0;
  }

  closeMessage() {
    this.showAnnouncement = false;
  }

  close() {
    this.closeEvt.emit(true);
  }
}