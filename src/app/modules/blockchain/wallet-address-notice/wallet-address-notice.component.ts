import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { Web3WalletService } from '../web3-wallet.service';
import { BlockchainService } from '../blockchain.service';
import { FormToastService } from '../../../common/services/form-toast.service';

@Component({
  moduleId: module.id,
  selector: 'm-blockchain--wallet-address-notice',
  templateUrl: 'wallet-address-notice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockchainWalletAddressNoticeComponent implements OnInit {
  address: string;

  constructor(
    protected web3Wallet: Web3WalletService,
    protected blockchain: BlockchainService,
    protected router: Router,
    protected cd: ChangeDetectorRef,
    protected toasterService: FormToastService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) this.load();
  }

  async load() {
    let wallet = await this.web3Wallet.getCurrentWallet();

    if (wallet && !(await this.blockchain.getWallet())) {
      this.address = wallet;
      this.detectChanges();
    } else {
      if (isPlatformBrowser(this.platformId))
        setTimeout(() => this.load(), 10000); // check every 10 seconds if there's a wallet detected
    }
  }

  async setWallet() {
    try {
      await this.blockchain.setWallet({ address: this.address });

      this.router.navigate(['/wallet/tokens/addresses']);
      this.address = void 0;
      this.detectChanges();
    } catch (e) {
      this.toasterService.error(e);
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
