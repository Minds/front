import { Injectable } from '@angular/core';
import { Web3WalletService } from '../web3-wallet.service';
import { TokenContractService } from './token-contract.service';

@Injectable()
export class WireContractService {
  protected instance: any;

  constructor(
    protected web3Wallet: Web3WalletService,
    protected tokenContract: TokenContractService
  ) {
    this.load();
  }

  async load() {
    this.instance = this.web3Wallet.getContract(
      this.web3Wallet.config.wire.address,
      this.web3Wallet.config.wire.abi
    );

    this.wire(); // Refresh default account
  }

  async wire(
    gasPriceGwei: number = this.web3Wallet.config.default_gas_price || 1
  ) {
    if (!this.instance) {
      throw new Error('No wire instance');
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

  // Wire

  async create(receiver: string, amount: number, message: string = '') {
    return await this.web3Wallet.sendSignedContractMethod(
      await this.tokenContract.token(),
      'approveAndCall',
      [
        this.instance.target,
        this.tokenContract.tokenToUnit(amount),
        this.tokenContract.encodeParams([
          {
            type: 'address',
            value: receiver,
          },
        ]),
      ],
      `Send ${amount} Tokens to ${receiver}. ${message}`.trim()
    );
  }

  // Service provider

  static _(web3Wallet: Web3WalletService, tokenContract: TokenContractService) {
    return new WireContractService(web3Wallet, tokenContract);
  }
}
