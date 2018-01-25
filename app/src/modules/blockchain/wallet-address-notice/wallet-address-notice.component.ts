import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Web3WalletService } from '../web3-wallet.service';
import { BlockchainService } from '../blockchain.service';

@Component({
  moduleId: module.id,
  selector: 'm-blockchain--wallet-address-notice',
  templateUrl: 'wallet-address-notice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockchainWalletAddressNoticeComponent implements OnInit {
  address: string;

  constructor(
    protected web3Wallet: Web3WalletService,
    protected blockchain: BlockchainService,
    protected router: Router,
    protected cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    await this.web3Wallet.ready();

    let wallet = await this.web3Wallet.getCurrentWallet();

    if (wallet && !await this.blockchain.getWallet()) {
      this.address = wallet;
      this.detectChanges();
    }
  }

  navigate() {
    this.router.navigate([ '/wallet/crypto/overview', { auto: 1 } ]);
    this.address = void 0;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
