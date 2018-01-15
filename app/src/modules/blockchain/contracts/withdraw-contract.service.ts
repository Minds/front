import { Injectable } from '@angular/core';
import { Web3WalletService } from '../web3-wallet.service';
import { TokenContractService } from './token-contract.service';
import { TransactionOverlayService } from '../transaction-overlay/transaction-overlay.service';

@Injectable()
export class WithdrawContractService {
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

    this.instance = this.web3Wallet.eth.contract(this.web3Wallet.config.withdraw.abi, '0x')
      .at(this.web3Wallet.config.withdraw.address);

    if (!this.instance) {
      throw new Error('No withdraw instance');
    }

    if (!this.instance.defaultTxObject) {
      this.instance.defaultTxObject = {};
    }

    // Refresh default account due a bug in Metamask
    this.instance.defaultTxObject.from = await this.web3Wallet.eth.coinbase();
    this.instance.defaultTxObject.gasPrice = this.web3Wallet.web3.toWei(1, 'Gwei');

    return this.instance;
  }

  // Withdraw

  async request(guid: string | number, amount: number) {
    const tokens = amount / (10 ** 18);
    const gasLimit = 67839; //TODO: make this dynamic
    const gas = this.instance.defaultTxObject.gasPrice * gasLimit;
    const gasEther = this.web3Wallet.web3.fromWei(gas, 'ether');

    return await this.overlayService.showAndRun(
      async () => {
        return {
          address: this.instance.defaultTxObject.from,
          guid: guid,
          amount: amount,
          gas: gas,
          tx: await this.instance.request(guid, amount, { value: gas })
        };
      }
    ,"You're about to request a withdrawal of " + tokens + " tokens", `NOTE: Your client will show ${gasEther} ETH to cover the gas fee. If you send too low a gas fee, your withdrawal may fail.`);
  }

  // Service provider

  static _(web3Wallet: Web3WalletService, tokenContract: TokenContractService, overlayService: TransactionOverlayService) {
    return new WithdrawContractService(web3Wallet, tokenContract, overlayService);
  }

}
