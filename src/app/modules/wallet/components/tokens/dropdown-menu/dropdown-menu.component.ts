import { DOCUMENT } from '@angular/common';
import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { OnchainTransferModalService } from '../../components/onchain-transfer/onchain-transfer.service';
import { WalletV2Service } from '../../wallet-v2.service';

/**
 * Menu of token-related actions
 *
 * See it in wallet > tokens page, at the end of the wallet address excerpt
 */
@Component({
  selector: 'm-walletTokens__dropdownMenu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.ng.scss'],
})
export class WalletTokensDropdownMenu {
  address$: Observable<string> = this.walletService.wallet$.pipe(
    map((wallet) => wallet.receiver.address)
  );

  canDisconnect$: Observable<boolean> = this.walletService.wallet$.pipe(
    map((wallet) => !!wallet.receiver.address)
  );

  @ViewChild('addressEl') addressElement;

  constructor(
    private walletService: WalletV2Service,
    @Inject(DOCUMENT) private dom,
    private toasterService: ToasterService,
    private onchainTransferModal: OnchainTransferModalService,
    private injector: Injector
  ) {}

  /**
   * Will open up transfer onchain modal - TODO
   * @param e
   */
  onTransferTokensClick(e: MouseEvent) {
    this.onchainTransferModal.setInjector(this.injector).present().toPromise();
  }

  async onDisconnectClick(e: MouseEvent): Promise<void> {
    await this.walletService.removeOnchainAddress();
  }

  async copyAddressToClipboard(e: MouseEvent) {
    const el = this.addressElement.nativeElement;
    const selection = window.getSelection();
    const range = this.dom.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      this.dom.execCommand('copy');
      selection.removeAllRanges();

      this.toasterService.success('Address copied to clipboard.');
    } catch (e) {
      this.toasterService.warn(
        'Sorry, we are unable to copy to your clipboard'
      );
    }
  }
}
