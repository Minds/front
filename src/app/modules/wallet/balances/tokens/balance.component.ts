import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as BN from 'bn.js';

import { Client } from '../../../../services/api/client';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import { TokenContractService } from '../../../blockchain/contracts/token-contract.service';

@Component({
  moduleId: module.id,
  selector: 'm-wallet--balance-tokens',
  templateUrl: 'balance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WalletBalanceTokensComponent implements OnInit {

  inProgress: boolean = false;
  balance: number = 0;
  addresses: Array<any> = [];
  minds = window.Minds;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected web3Wallet: Web3WalletService,
    protected tokenContract: TokenContractService,
  ) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    await this.loadRemote();
    await this.loadLocal();
  }

  async loadLocal() {
   
    try {
      const address = await this.web3Wallet.getCurrentWallet();
      if (!address) 
        return;

      //check to see if this address is different to the receiver address
      for (let i = 0; i < this.addresses.length; i++) {
        if (this.addresses[i].address == address) {
          this.addresses[i].label = 'OnChain & Receiver';
          this.detectChanges();
          return; //no need to count twice
        }
      }

      const balance = await this.tokenContract.balanceOf(address);
      this.balance = (new BN(this.balance)).add(balance[0]);
      this.addresses.unshift({
        'label': "OnChain",
        'address': address,
        'balance': balance[0].toString(),
      });
      this.detectChanges();
    } catch (e) {
      console.log(e);
    }
  }

  async loadRemote() {
    this.inProgress = true;
    this.detectChanges();

    try {
      let response: any = await this.client.get(`api/v2/blockchain/wallet/balance`);

      if (response) {
        this.balance = response.balance;
        this.addresses = response.addresses;
      } else {
        console.error('No data');
        this.balance = 0;
      }
    } catch (e) {
      console.error(e);
      this.balance = 0;
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
