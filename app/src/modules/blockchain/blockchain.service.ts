import { Injectable } from '@angular/core';
import { Client } from '../../services/api/client';

@Injectable()
export class BlockchainService {
  protected serverWalletAddressCache: string;
  protected serverBalanceCache: number | string;

  constructor(private client: Client) { }

  // Wallet

  async getWallet(refresh?: boolean) {
    if (!refresh && this.serverWalletAddressCache) {
      return this.serverWalletAddressCache;
    }

    this.serverWalletAddressCache = void 0;

    let response: any = await this.client.get(`api/v1/blockchain/wallet/address`);

    if (response.wallet) {
      this.serverWalletAddressCache = response.wallet.address;
      return response.wallet.address
    } else {
      throw new Error('There was an issue getting your saved wallet info');
    }
  }

  async setWallet(data) {
    await this.client.post(`api/v1/blockchain/wallet`, data);

    this.serverWalletAddressCache = data.address;
  }

  async getBalance(refresh?: boolean) {
    if (!refresh && typeof this.serverBalanceCache !== 'undefined') {
      return this.serverBalanceCache;
    }

    this.serverBalanceCache = void 0;

    try {
      let response: any = await this.client.get(`api/v1/blockchain/wallet/balance`);

      if (!response.wallet) {
        return false;
      }

      this.serverBalanceCache = response.wallet.balance;

      return response.wallet.balance;
    } catch (e) {
      return false;
    }
  }

  // Service provider

  static _(client: Client) {
    return new BlockchainService(client);
  }
}
