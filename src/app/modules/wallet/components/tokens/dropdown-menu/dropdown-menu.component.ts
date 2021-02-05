import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BuyTokensModalService } from '../../../../blockchain/token-purchase/v2/buy-tokens-modal.service';
import { WalletV2Service } from '../../wallet-v2.service';

@Component({
  selector: 'm-walletTokens__dropdownMenu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.ng.scss'],
})
export class WalletTokensDropdownMenu {
  canDisconnect$: Observable<boolean> = this.walletService.wallet$.pipe(
    map(wallet => !!wallet.receiver.address)
  );

  constructor(
    private buyTokensService: BuyTokensModalService,
    private walletService: WalletV2Service
  ) {}

  /**
   * Will open up transfer onchain modal - TODO
   * @param e
   */
  onTransferTokensClick(e: MouseEvent) {
    alert("Olivia's modal will open here");
  }

  /**
   * Opens up buy tokens modal
   * @param e
   */
  async onPurchaseTokensClick(e: MouseEvent): Promise<void> {
    await this.buyTokensService.open();
  }

  async onDisconnectClick(e: MouseEvent): Promise<void> {
    await this.walletService.removeOnchainAddress();
  }
}
