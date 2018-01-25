import { Injectable } from '@angular/core';
import { Web3WalletService } from '../web3-wallet.service';

@Injectable()
export class TokenDistributionEventService {
  protected instance: any;

  constructor(
    protected web3Wallet: Web3WalletService
  ) { }

  // Buy tokens

  async buy(ethAmount: number, gasPriceGwei: number = this.web3Wallet.config.default_gas_price || 1, message: string = '') {
    await this.web3Wallet.ready();

    let wallet = await this.web3Wallet.getCurrentWallet();

    if (!wallet) {
      throw new Error('Client is locked, there are no wallets available, or you\'re on a different network');
    }

    return this.web3Wallet.sendTransaction({
      from: wallet,
      to: this.web3Wallet.config.token_distribution_event_address,
      value: this.web3Wallet.EthJS.toWei(ethAmount, 'ether'),
      gasPrice: this.web3Wallet.EthJS.toWei(gasPriceGwei, 'Gwei'),
      data: '0x'
    }, `Buy ${ethAmount} ETH worth of Minds Tokens. ${message}`.trim());
  }

  // Service provider

  static _(web3Wallet: Web3WalletService) {
    return new TokenDistributionEventService(web3Wallet);
  }
}
