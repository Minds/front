import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api/client';
import { TokenContractService } from '../../../blockchain/contracts/token-contract.service';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import * as BN from 'bn.js';

@Component({
  selector: 'm-wallet-token--testnet',
  templateUrl: 'testnet.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class WalletTokenTestnetComponent {

  offchainBalance: number = 0;
  inProgress: boolean = false;
  error: string;

  address: string = "";
  user = window.Minds.user;

  savedConfig;

  constructor(
    public session: Session,
    private client: Client,
    private cd: ChangeDetectorRef,
    private token: TokenContractService,
    private web3Wallet: Web3WalletService,
  ) {
    this.loadBalance();
  }

  async ngOnInit() {
    this.savedConfig = Object.assign({}, window.Minds.blockchain);

    window.Minds.blockchain.client_network = 4; //rinkeby
    window.Minds.blockchain.token.address = '0xf5f7ad7d2c37cae59207af43d0beb4b361fb9ec8';
    window.Minds.blockchain.network_address = 'https://rinkeby.infura.io/';

    this.web3Wallet.config = window.Minds.blockchain;

    await this.web3Wallet.ready();
    const wallet = await this.web3Wallet.getCurrentWallet();
    if (wallet)
      this.address = wallet;

    await this.token.load();

    try {
      await this.checkWallet();
    } catch (err) {
      this.error = err;
    } 
  }

  async checkWallet() {
    if (this.web3Wallet.isUnavailable()) {
      throw 'No Ethereum wallets available on your browser.';
    } else if (!(await this.web3Wallet.unlock())) {
      throw 'Your Ethereum wallet is locked or connected to another network. Ensure you are on the Rinkeby Network.';
    }
  }

  async loadBalance() {
    this.inProgress = true;
    // this.detectChanges();

    try {
      let response: any = await this.client.get(`api/v2/blockchain/wallet/balance`);

      if (response) {
        this.offchainBalance = response.addresses[1].balance;
      } else {
        console.error('No data');
        this.offchainBalance = 0;
      }
    } catch (e) {
      console.error(e);
      this.offchainBalance = 0;
    } finally {
      this.inProgress = false;
      // this.detectChanges();
    }
  }

  async transfer() {
    this.inProgress = true;
    await this.web3Wallet.ready();

    const wallet = await this.web3Wallet.getCurrentWallet();
    if (wallet)
      this.address = wallet;

    await this.token.token();

    try {
      const balanceOf = await this.token.balanceOf(this.address);

      if (balanceOf.balance.lte(new BN(0))) {
        throw "You do not have any tokens to transfer. If you have already made a transfer please allow 7 days.";
      }

      const txHash = await (await this.token.token()).transfer('0x461f1c5768cdb7e567a84e22b19db0eaba069bad', balanceOf.balance, {
        gas: 67839
      });

      alert('Completed. Please see tx: ' + txHash);

    } catch (err) {
      this.error = err;
      this.inProgress = false;
      return;
    }

    this.inProgress = false;
  }

  ngOnDestroy() {
    window.Minds.blockchain = this.savedConfig;
  }

  // detectChanges() {
  //   this.cd.markForCheck();
  //   this.cd.detectChanges();
  // }
}
