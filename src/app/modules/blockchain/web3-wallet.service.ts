import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import * as Eth from 'ethjs';
import * as SignerProvider from 'ethjs-provider-signer';

import { LocalWalletService } from './local-wallet.service';
import callbackToPromise from '../../helpers/callback-to-promise';
import asyncSleep from '../../helpers/async-sleep';
import { TransactionOverlayService } from './transaction-overlay/transaction-overlay.service';
import { ConfigsService } from '../../common/services/configs.service';

@Injectable()
export class Web3WalletService {
  eth: any;
  EthJS: any;

  public config; // TODO add types

  protected unavailable: boolean = false;
  protected local: boolean = false;
  protected _ready: Promise<any>;
  protected _web3LoadAttempt: number = 0;

  constructor(
    protected localWallet: LocalWalletService,
    protected transactionOverlay: TransactionOverlayService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private configs: ConfigsService
  ) {
    this.config = this.configs.get('blockchain');
  }

  // Wallet

  async getWallets(forceAuthorization: boolean = false) {
    try {
      await this.ready();

      if (!(await this.isSameNetwork())) {
        return false;
      }

      if (forceAuthorization && window.ethereum) {
        await window.ethereum.enable();
      }

      return await this.eth.accounts();
    } catch (e) {
      return false;
    }
  }

  async getCurrentWallet(
    forceAuthorization: boolean = false
  ): Promise<string | false> {
    let wallets = await this.getWallets(forceAuthorization);

    if (!wallets || !wallets.length) {
      return false;
    }

    return wallets[0];
  }

  async getBalance(address): Promise<string | false> {
    return new Promise<string | false>((resolve, reject) => {
      if (!window.web3 && !window.web3.eth) return reject(false);
      window.web3.eth.getBalance(address, (error, result) => {
        if (error) {
          console.log(error);
          return reject(false);
        }
        resolve(result.toNumber());
      });
    });
  }

  async isLocked() {
    return !(await this.getCurrentWallet());
  }

  async isLocal() {
    await this.ready();
    return this.local;
  }

  async setupMetamask() {
    if (await this.isLocal()) {
      return await this.localWallet.setupMetamask();
    }
  }

  async unlock() {
    if ((await this.isLocal()) && (await this.isLocked())) {
      await this.localWallet.unlock();
    }

    await this.getCurrentWallet(true);
    return !(await this.isLocked());
  }

  // Network

  async isSameNetwork() {
    if (await this.isLocal()) {
      // Using local provider means we're on the same network
      return true;
    }

    // assume main network
    return (
      ((await callbackToPromise(window.web3.version.getNetwork)) || 1) ==
      this.config.client_network
    );
  }

  // Bootstrap

  setUp() {
    this.config = this.configs.get('blockchain');
    this.ready() // boot web3 loading
      .catch(e => {
        console.error('[Web3WalletService]', e);
      });
  }

  ready(): Promise<any> {
    if (!this._ready) {
      this._ready = new Promise((resolve, reject) => {
        if (
          isPlatformBrowser(this.platformId) &&
          typeof window.web3 !== 'undefined'
        ) {
          this.loadFromWeb3();
          return resolve(true);
        }

        this.waitForWeb3(resolve, reject);
      });
    }

    return this._ready;
  }

  private waitForWeb3(resolve, reject) {
    this._web3LoadAttempt++;

    if (this._web3LoadAttempt > 3 || isPlatformServer(this.platformId)) {
      this.loadLocal();
      return resolve(true);
    }

    setTimeout(() => {
      if (typeof window.web3 !== 'undefined') {
        this.loadFromWeb3();
        return resolve(true);
      }

      setTimeout(() => this.waitForWeb3(resolve, reject), 0);
    }, 1000);
  }

  private loadFromWeb3() {
    this.EthJS = Eth;

    // MetaMask found
    this.eth = new Eth(window.ethereum || window.web3.currentProvider);
    this.local = false;
  }

  private loadLocal() {
    this.EthJS = Eth;
    // Non-metamask
    this.eth = new Eth(
      new SignerProvider(this.config.network_address, {
        signTransaction: (rawTx, cb) =>
          this.localWallet.signTransaction(rawTx, cb),
        accounts: cb => this.localWallet.accounts(cb),
      })
    );
    this.local = true;
  }

  isUnavailable() {
    return this.unavailable;
  }

  // Contract Methods

  async sendSignedContractMethodWithValue(
    contract: any,
    method: string,
    params: any[],
    value: number | string,
    message: string = '',
    tokenDelta: number = 0
  ): Promise<string> {
    let txHash;

    if (await this.isLocal()) {
      await this.localWallet.unlock();

      let passedTxObject = { value, ...contract.defaultTxObject };

      if (!passedTxObject.gas) {
        passedTxObject.gas = 300000; // TODO: estimate gas
      }

      let txObject = await this.transactionOverlay.waitForLocalTxObject(
        passedTxObject,
        message,
        tokenDelta
      );

      txHash = await contract[method](...params, txObject);

      this.localWallet.prune();
    } else {
      txHash = await this.transactionOverlay.waitForExternalTx(
        () => contract[method](...params, { value }),
        message
      );
    }

    await asyncSleep(this.isLocal() ? 250 : 1000); // Modals "cooldown"

    return txHash;
  }

  async sendSignedContractMethod(
    contract: any,
    method: string,
    params: any[],
    message: string = '',
    tokenDelta: number = 0
  ): Promise<string> {
    return await this.sendSignedContractMethodWithValue(
      contract,
      method,
      params,
      0,
      message,
      tokenDelta
    );
  }

  // Normal Transactions

  async sendTransaction(
    originalTxObject: any,
    message: string = ''
  ): Promise<string> {
    let txHash;

    if (await this.isLocal()) {
      await this.localWallet.unlock();

      if (!originalTxObject.gas) {
        originalTxObject.gas = 300000; // TODO: estimate gas
      }

      let txObject = await this.transactionOverlay.waitForLocalTxObject(
        originalTxObject,
        message
      );

      txHash = await this.eth.sendTransaction(txObject);

      this.localWallet.prune();
    } else {
      txHash = await this.transactionOverlay.waitForExternalTx(
        () => this.eth.sendTransaction(originalTxObject),
        message
      );
    }

    await asyncSleep(this.isLocal() ? 250 : 1000); // Modals "cooldown"

    return txHash;
  }

  // Provider

  getOnChainInterfaceLabel() {
    if (this.local) {
      return 'Private Key';
    }

    if (
      window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider'
    ) {
      return 'Metamask';
    } else if (
      window.web3.currentProvider.constructor.name === 'EthereumProvider'
    ) {
      return 'Mist';
    } else if (window.web3.currentProvider.constructor.name === 'o') {
      return 'Parity';
    }

    return 'Local Interface';
  }

  // Service provider

  static _(
    localWallet: LocalWalletService,
    transactionOverlay: TransactionOverlayService,
    platformId: Object,
    configs: ConfigsService
  ) {
    return new Web3WalletService(
      localWallet,
      transactionOverlay,
      platformId,
      configs
    );
  }
}
