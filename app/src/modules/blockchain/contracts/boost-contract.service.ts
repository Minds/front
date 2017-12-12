import { Injectable } from '@angular/core';
import { Web3WalletService } from '../web3-wallet.service';
import { TokenContractService } from './token-contract.service';
import { TransactionOverlayService } from '../transaction-overlay/transaction-overlay.service';

@Injectable()
export class BoostContractService {
  protected instance: any;

  constructor(
    protected web3Wallet: Web3WalletService,
    protected tokenContract: TokenContractService,
    protected overlayService: TransactionOverlayService
  ) {
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
    return await this.overlayService.showAndRun(async () => {
      return (await this.tokenContract.token()).approveAndCall(
        this.instance.address,
        this.tokenContract.tokenToUnit(amount),
        this.tokenContract.encodeParams([{
          type: 'address',
          value: this.web3Wallet.config.boost_wallet_address
        }, { type: 'uint256', value: guid }])
      );
    }, "You're creating a boost");
  }

  async createPeer(receiver: string, guid: string, amount: number) {
    return await this.overlayService.showAndRun(async () => {
      return (await this.tokenContract.token()).approveAndCall(
        this.instance.address,
        this.tokenContract.tokenToUnit(amount),
        this.tokenContract.encodeParams([{ type: 'address', value: receiver }, { type: 'uint256', value: guid }])
      )
    }, "You're creating a boost");
  }

  async accept(guid: string) {
    return await this.overlayService.showAndRun(async () => (await this.boost()).accept(guid), "You're about to accept a boost", false);
  }

  async reject(guid: string) {
    return await this.overlayService.showAndRun(async () => (await this.boost()).reject(guid), "You're about to reject a boost", false);
  }

  async revoke(guid: string) {
    return await this.overlayService.showAndRun(async () => (await this.boost()).revoke(guid), "You're about to revoke a boost", false);
  }

  // Service provider

  static _(web3Wallet: Web3WalletService, tokenContract: TokenContractService, blockchainOverlayService: TransactionOverlayService) {
    return new BoostContractService(web3Wallet, tokenContract, blockchainOverlayService);
  }
}
