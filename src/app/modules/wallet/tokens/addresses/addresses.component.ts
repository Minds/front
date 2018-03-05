import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';

@Component({
  moduleId: module.id,
  selector: 'm-wallet-token--addresses',
  templateUrl: 'addresses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WalletTokenAddressesComponent {

  receiverAddress: string = '';
  addresses: Array<{label: string, address?: string, selected: boolean}> = [];
  inProgress: boolean = false;
  editing: boolean = false;

  constructor(
    protected client: Client,
    protected web3Wallet: Web3WalletService,
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected session: Session,
  ) {
  }

  async ngOnInit() {
    this.receiverAddress = this.session.getLoggedInUser().eth_wallet;
    if (!this.receiverAddress)
      this.editing = true;
    await this.getAddresses();
  }

  async getAddresses() {
    this.inProgress = true;
    this.addresses = [
      {
        address: this.receiverAddress,
        label: 'Receiver',
        selected: true
      },
      {
        label: 'OffChain',
        address: 'offchain',
        selected: true
      }
    ];

    try {
      const onchainAddress = await this.web3Wallet.getCurrentWallet();
      if (!onchainAddress)
        return;

      if (this.addresses[0].address == onchainAddress) {
        this.addresses[0].label = 'OnChain & Receiver';
        this.detectChanges();
        return; //no need to count twice
      }

      this.addresses.unshift({
        'label': "OnChain",
        'address': onchainAddress,
        'selected': true
      });
      this.detectChanges();
    } catch (e) {
      console.log(e);
    }
  }

  enableEditing() {
    this.session.getLoggedInUser().eth_wallet = '';
    this.editing = true;
  }

  disableEditing() {
    this.receiverAddress = this.session.getLoggedInUser().eth_wallet;
    this.editing = false;
    //this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
