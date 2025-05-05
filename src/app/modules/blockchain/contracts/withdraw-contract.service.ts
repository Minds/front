import { Injectable } from '@angular/core';
import { parseUnits } from 'ethers';

import { Web3WalletService } from '../web3-wallet.service';

@Injectable()
export class WithdrawContractService {
  protected instance: any;

  constructor(protected web3Wallet: Web3WalletService) {
    this.load();
  }

  async load() {
    this.instance = this.web3Wallet.getContract(
      this.web3Wallet.config.withdraw.address,
      this.web3Wallet.config.withdraw.abi
    );

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
      this.instance.defaultTxObject.from =
        await this.web3Wallet.getCurrentWallet();
      this.instance.defaultTxObject.gasPrice = this.web3Wallet.toWei(
        gasPriceGwei,
        'gwei'
      );
    }

    return this.instance;
  }

  // Withdraw

  async request(guid: string | number, amount: string, message: string = '') {
    await this.contract(); //wait for instance to get correct info

    const tokens = this.web3Wallet.fromWei(amount);

    const gasLimit = 67839n; //TODO: make this dynamic
    const gasPrice = BigInt(this.instance.defaultTxObject.gasPrice);
    const gas = gasPrice * gasLimit;

    const gasEther = this.web3Wallet.fromWei(gas);

    let tx = await this.web3Wallet.sendSignedContractMethodWithValue(
      await this.contract(),
      'request',
      [guid, amount.toString()],
      gas.toString(),
      `Request a withdrawal of ${tokens} Minds Tokens. ~${gasEther.toString()} ETH will be transferred to cover the gas fee. If you send a low amount of gas fee, your withdrawal may fail. ${message}`.trim()
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
