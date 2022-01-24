import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UniswapModalService } from '../token-purchase/v2/uniswap/uniswap-modal.service';
import { Web3WalletService } from '../web3-wallet.service';
import { ComposerModalService } from '../../composer/components/modal/modal.service';
import { ComposerService } from '../../composer/services/composer.service';
import { OnchainTransferModalService } from '../../wallet/components/components/onchain-transfer/onchain-transfer.service';

@Component({
  selector: 'm-earn__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'earn-modal.component.html',
  styleUrls: ['./earn-modal.component.ng.scss'],
  providers: [ComposerService],
})
export class EarnModalComponent {
  onDismissIntent: () => void = () => {};

  constructor(
    private uniswapModalService: UniswapModalService,
    private web3walletService: Web3WalletService,
    private composerModal: ComposerModalService,
    private injector: Injector,
    private onchainTransferModalService: OnchainTransferModalService
  ) {}

  async openAddLiquidity() {
    this.onDismissIntent();
    await this.web3walletService.getCurrentWallet(true);
    await this.uniswapModalService.open('add');
  }

  openTransfer() {
    this.onDismissIntent();
    this.onchainTransferModalService
      .setInjector(this.injector)
      .present()
      .toPromise();
  }

  async openCompose() {
    this.onDismissIntent();
    this.composerModal.setInjector(this.injector).present();
  }

  setModalData({ onDismissIntent }) {
    this.onDismissIntent = onDismissIntent || (() => {});
  }
}
