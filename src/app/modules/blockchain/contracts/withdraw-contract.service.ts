import { Injectable } from '@angular/core';
import * as BN from 'bn.js';

import { Web3WalletService } from '../web3-wallet.service';

@Injectable()
export class WithdrawContractService {
  protected instance: any;

  constructor(protected web3Wallet: Web3WalletService) {
    console.log('withdraw contract called');
    this.load();
  }

  async load() {
    await this.web3Wallet.ready();

    this.instance = this.web3Wallet.eth
      .contract(this.web3Wallet.config.withdraw.abi, '0x')
      .at(this.web3Wallet.config.withdraw.address);

    this.contract();
  }

  async contract(
    gasPriceGwei: number = this.web3Wallet.config.default_gas_price || 1
  ) {
    if (!this.instance) {
      throw new Error('No withdraw instance');
    }

    if (!this.instance.defaultTxObject) {
      this.instance.defaultTxObject = {};
    }

    // Refresh default account due a bug in Metamask
    const wallet = await this.web3Wallet.getCurrentWallet();
    if (wallet) {
      this.instance.defaultTxObject.from = await this.web3Wallet.getCurrentWallet();
      this.instance.defaultTxObject.gasPrice = this.web3Wallet.EthJS.toWei(
        gasPriceGwei,
        'Gwei'
      );
    }

    return this.instance;
  }

  // Withdraw

  async request(guid: string | number, amount: number, message: string = '') {
    await this.contract(); //wait for instance to get correct info
    const tokens = amount / 10 ** 18;
    const gasLimit = 67839; //TODO: make this dynamic
    const gas = new BN(this.instance.defaultTxObject.gasPrice).mul(
      new BN(gasLimit)
    );
    const gasEther = this.web3Wallet.EthJS.fromWei(gas, 'ether');

    let tx = await this.web3Wallet.sendSignedContractMethodWithValue(
      await this.contract(),
      'request',
      [guid, amount],
      gas.clone(),
      `Request a withdrawal of ${tokens} Minds Tokens. ${gasEther} ETH will be transferred to cover the gas fee. If you send a low amount of gas fee, your withdrawal may fail. ${message}`.trim()
    );

    return {
      address: (await this.contract()).defaultTxObject.from,
      guid,
      amount: amount.toString(),
      gas: gas.toString(),
      tx,
    };
  }

  // Service provider

  static _(web3Wallet: Web3WalletService) {
    return new WithdrawContractService(web3Wallet);
  }
}
