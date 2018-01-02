import { Injectable } from '@angular/core';
import { Web3WalletService } from '../web3-wallet.service';
import { TokenContractService } from './token-contract.service';
import { TransactionOverlayService } from '../transaction-overlay/transaction-overlay.service';

@Injectable()
export class WireContractService {
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

    this.instance = this.web3Wallet.eth.contract(this.web3Wallet.config.wire.abi, '0x')
      .at(this.web3Wallet.config.wire.address);

    this.wire(); // Refresh default account
  }

  async wire(gasPriceGwei: number = this.web3Wallet.config.default_gas_price || 1) {
    if (!this.instance) {
      throw new Error('No wire instance');
    }

    if (!this.instance.defaultTxObject) {
      this.instance.defaultTxObject = {};
    }

    // Refresh default account due a bug in Metamask
    this.instance.defaultTxObject.from = await this.web3Wallet.eth.coinbase();
    this.instance.defaultTxObject.gasPrice = this.web3Wallet.web3.toWei(gasPriceGwei, 'Gwei');

    return this.instance;
  }

  // Wire

  async create(receiver: string, amount: number) {
    return await this.overlayService.showAndRun(
      async () => {
        return (await this.tokenContract.token()).approveAndCall(
          this.instance.address,
          this.tokenContract.tokenToUnit(amount),
          this.tokenContract.encodeParams([{ type: 'address', value: receiver }])
        );
      }
    ,"You're about to wire someone", `NOTE: Your client will show 0 ETH as we use the Ethereum network, but ${amount} Minds tokens will be sent.`);
  }

  // Service provider

  static _(web3Wallet: Web3WalletService, tokenContract: TokenContractService, overlayService: TransactionOverlayService) {
    return new WireContractService(web3Wallet, tokenContract, overlayService);
  }
}
