import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Web3WalletService } from '../web3-wallet.service';
import { TokenContractService } from './token-contract.service';
import { isPlatformBrowser } from '@angular/common';
import { BigNumber } from 'ethers';

@Injectable()
export class BoostContractService {
  protected instance: any;

  constructor(
    protected web3Wallet: Web3WalletService,
    protected tokenContract: TokenContractService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      this.load();
    }
  }

  async load() {
    this.instance = this.web3Wallet.getContract(
      this.web3Wallet.config.boost.address,
      this.web3Wallet.config.boost.abi
    );

    this.boost(); // Refresh default account
  }

  async boost(
    gasPriceGwei: number = this.web3Wallet.config.default_gas_price || 1
  ) {
    if (!this.instance) {
      throw new Error('No boost instance');
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

  // Boost

  async create(
    guid: string,
    amount: number,
    checksum: string,
    message: string = ''
  ) {
    const checksumInt = BigNumber.from('0x' + checksum).toString();

    // Increase the approval

    await this.web3Wallet.sendSignedContractMethod(
      await this.tokenContract.token(),
      'approve',
      [this.instance.address, this.tokenContract.tokenToUnit(amount)]
    );

    // Send the transaction

    return await this.web3Wallet.sendSignedContractMethod(
      this.instance,
      'boost',
      [
        guid,
        this.web3Wallet.config.boost_wallet_address,
        this.tokenContract.tokenToUnit(amount),
        checksumInt,
      ],
      `Network Boost for ${amount} Tokens. ${message}`.trim()
    );
  }

  async createPeer(
    receiver: string,
    guid: string,
    amount: number,
    checksum: string,
    message: string = ''
  ) {
    return await this.web3Wallet.sendSignedContractMethod(
      await this.tokenContract.token(),
      'approveAndCall',
      [
        this.instance.address,
        this.tokenContract.tokenToUnit(amount),
        this.tokenContract.encodeParams([
          {
            type: 'address',
            value: receiver,
          },
          {
            type: 'uint256',
            value: guid,
          },
          {
            type: 'uint256',
            value: checksum,
          },
        ]),
      ],
      `Channel Boost for ${amount} Tokens to ${receiver}. ${message}`.trim()
    );
  }

  async accept(guid: string, message: string = '') {
    return await this.web3Wallet.sendSignedContractMethod(
      await this.boost(),
      'accept',
      [guid],
      `Accept a Channel Boost. ${message}`.trim()
    );
  }

  async reject(guid: string, message: string = '') {
    return await this.web3Wallet.sendSignedContractMethod(
      await this.boost(),
      'reject',
      [guid],
      `Reject a Channel Boost. ${message}`.trim()
    );
  }

  async revoke(guid: string, message: string = '') {
    return await this.web3Wallet.sendSignedContractMethod(
      await this.boost(),
      'revoke',
      [guid],
      `Revoke a Boost. ${message}`.trim()
    );
  }
}
