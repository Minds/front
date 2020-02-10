import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import * as BN from 'bn.js';

import { Web3WalletService } from '../web3-wallet.service';
import { TransactionOverlayService } from '../transaction-overlay/transaction-overlay.service';
import { isPlatformBrowser } from '@angular/common';

export interface TokenApproveAndCallParam {
  type: string;
  value: any;
}

export type TokenApproveAndCallParams = TokenApproveAndCallParam[];

@Injectable()
export class TokenContractService {
  protected instance: any;

  constructor(
    protected web3Wallet: Web3WalletService,
    protected overlayService: TransactionOverlayService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      this.load();
    }
  }

  async load() {
    await this.web3Wallet.ready();

    this.instance = this.web3Wallet.eth
      .contract(this.web3Wallet.config.token.abi, '0x')
      .at(this.web3Wallet.config.token.address);

    this.token(); // Refresh default account
  }

  async token(
    gasPriceGwei: number = this.web3Wallet.config.default_gas_price || 1
  ) {
    if (!this.instance) {
      throw new Error('No token instance');
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

  // Direct Minds payments

  async payment(amount: number) {
    return (await this.token()).transfer(
      this.web3Wallet.config.wallet_address,
      this.tokenToUnit(amount)
    );
  }

  // Balances

  async balanceOf(address: string) {
    return (await this.token()).balanceOf(address);
  }

  // Token allowance

  async increaseApproval(
    address: string,
    amount: number,
    message: string = ''
  ) {
    return await this.web3Wallet.sendSignedContractMethod(
      await this.token(),
      'approve',
      [address, this.tokenToUnit(amount)],
      `${message}`.trim()
    );
  }

  tokenToUnit(amount: number) {
    const precision = 5;

    if (amount === 0) {
      return 0;
    }

    const value = new BN(10)
      .pow(new BN(this.web3Wallet.config.token.decimals - precision))
      .mul(new BN(Math.round(amount * 10 ** precision)));

    return value.toString();
  }

  // Token approveAndCall parameters. Adds 80 + 40 padding

  encodeParams(params: TokenApproveAndCallParams): string {
    const types = ['uint256', 'uint256'],
      values = [0x80, 0x40];

    for (let param of params) {
      types.push(param.type);
      values.push(param.value);
    }

    return this.web3Wallet.eth.constructor.abi.encodeParams(types, values);
  }
}
