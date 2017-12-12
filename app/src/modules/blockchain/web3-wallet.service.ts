import { Injectable } from '@angular/core';

declare const Eth;

@Injectable()
export class Web3WalletService {
  eth: any;
  web3: any;

  config = window.Minds.blockchain;

  protected unavailable: boolean = false;

  protected _ready: Promise<any>;
  protected _web3LoadAttempt: number = 0;

  // Wallet

  async getWallets() {
    try {
      await this.ready();

      if (!await this.isSameNetwork()) {
        return false;
      }

      return await this.eth.accounts();
    } catch (e) {
      return false;
    }
  }

  async isLocked() {
    const wallets = await this.getWallets();
    return !wallets || !wallets.length;
  }

  // Network

  async isSameNetwork() {
    // assume main network
    return (await this.web3Promise(this.web3.version.getNetwork) || 1) == window.Minds.blockchain.client_network;
  }

  // Bootstrap

  setUp() {
    this.ready() // boot web3 loading
      .catch(e => {
        console.error('[Web3WalletService]', e);
      });
  }

  ready(): Promise<any> {
    if (!this._ready) {
      this._ready = new Promise((resolve, reject) => {
        if (typeof window.web3 !== 'undefined') {
          this.load();
          return resolve(true);
        }

        this.waitForWeb3(resolve, reject);
      });
    }

    return this._ready;
  }

  private waitForWeb3(resolve, reject) {
    this._web3LoadAttempt++;

    if (this._web3LoadAttempt > 10) {
      this.unavailable = true;

      return reject('Web3 is unavailable');
    }

    setTimeout(() => {
      if (typeof window.web3 !== 'undefined') {
        this.load();
        return resolve(true);
      }

      setTimeout(() => this.waitForWeb3(resolve, reject), 0);
    }, 1000);
  }

  private load() {
    this.web3 = window.web3;
    this.eth = new Eth(this.web3.currentProvider);
  }

  isUnavailable() {
    return this.unavailable;
  }

  // Web3 methods promise wrapper
  web3Promise(method, ...args) {
    return new Promise(function (resolve, reject) {
      args.push(function (error, result) {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });

      method.apply(null, args);
    });
  }

  getProviderName() {
    let providerName = 'UNKNOWN';

    if (window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider') {
      providerName = 'Metamask';
    }
    else if (window.web3.currentProvider.constructor.name === 'EthereumProvider') {
      providerName = 'Mist';
    }
    else if (window.web3.currentProvider.constructor.name === 'o') {
      providerName = 'Parity';
    }
    else if (window.web3.currentProvider.host.indexOf('infura') !== -1) {
      providerName = 'Infura';
    }
    else if (window.web3.currentProvider.host.indexOf('localhost') !== -1) {
      providerName = 'localhost';
    }
    return providerName;
  }

  // Service provider

  static _() {
    return new Web3WalletService();
  }
}
