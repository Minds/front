import { Injectable } from '@angular/core';
import { Web3WalletService } from '../web3-wallet.service';
import { TokenContractService } from './token-contract.service';

@Injectable()
export class BoostContractService {
  protected instance: any;

  constructor(protected web3Wallet: Web3WalletService, protected tokenContract: TokenContractService) {
    this.load();
  }

  async load() {
    await this.web3Wallet.ready();

    this.instance = this.web3Wallet.eth.contract(this.web3Wallet.config.peer_boost.abi, '0x')
      .at(this.web3Wallet.config.peer_boost.address);

    this.boost(); // Refresh default account
  }

  async boost(gasPriceGwei: number = this.web3Wallet.config.default_gas_price || 1) {
    if (!this.instance) {
      throw new Error('No boost instance');
    }

    if (!this.instance.defaultTxObject) {
      this.instance.defaultTxObject = {};
    }

    // Refresh default account due a bug in Metamask
    this.instance.defaultTxObject.from = await this.web3Wallet.eth.coinbase();
    this.instance.defaultTxObject.gasPrice = this.web3Wallet.web3.toWei(gasPriceGwei, 'Gwei');

    return this.instance;
  }

  // Boost

  async create(guid: string, amount: number) {
    return (await this.tokenContract.token()).approveAndCall(
      this.instance.address,
      this.tokenContract.tokenToUnit(amount),
      this.tokenContract.encodeParams([{ type: 'address', value: this.web3Wallet.config.boost_wallet_address }, { type: 'uint256', value: guid }])
    );
  }

  async createPeer(receiver: string, guid: string, amount: number) {
    return (await this.tokenContract.token()).approveAndCall(
      this.instance.address,
      this.tokenContract.tokenToUnit(amount),
      this.tokenContract.encodeParams([{ type: 'address', value: receiver }, { type: 'uint256', value: guid }])
    );
  }

  async accept(guid: string) {
    return (await this.boost()).accept(guid);
  }

  async reject(guid: string) {
    return (await this.boost()).reject(guid);
  }

  async revoke(guid: string) {
    return (await this.boost()).revoke(guid);
  }

  // Service provider

  static _(web3Wallet: Web3WalletService, tokenContract: TokenContractService) {
    return new BoostContractService(web3Wallet, tokenContract);
  }
}
