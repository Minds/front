import { Injectable } from '@angular/core';
import { Client } from '../../../common/api/client.service';
import { Session } from '../../../services/session';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';
import { BehaviorSubject, Observable } from 'rxjs';
import * as BN from 'bn.js';

import fakeData from './fake-data';

@Injectable()
export class WalletDashboardService {
  walletLoaded = false;
  totalTokens = 0;

  wallet: any = {
    tokens: {
      label: 'Tokens',
      unit: 'tokens',
      balance: 0,
      address: null,
    },
    offchain: {
      label: 'Off-chain',
      unit: 'tokens',
      balance: 0,
      address: 'offchain',
    },
    onchain: {
      label: 'On-chain',
      unit: 'tokens',
      balance: 0,
      address: null,
    },
    receiver: {
      label: 'Receiver',
      unit: 'tokens',
      balance: 0,
      address: null,
    },
    usd: {
      label: 'USD',
      unit: 'usd',
      balance: 0,
      address: null,
    },
    eth: {
      label: 'Ether',
      unit: 'eth',
      balance: 0,
      address: null,
    },
    btc: {
      label: 'Bitcoin',
      unit: 'btc',
      balance: 0,
      address: null,
    },
  };

  constructor(
    private client: Client,
    protected web3Wallet: Web3WalletService,
    protected tokenContract: TokenContractService,
    protected session: Session
  ) {}

  getWallet() {
    this.getTokenAccounts();
    this.getEthAccount();
    this.getStripeAccount();

    // TODOOJM comment me
    // this.wallet = fakeData.wallet;

    this.walletLoaded = true;
    return this.wallet;
  }

  async getTokenAccounts() {
    await this.loadOffchainAndReceiver();
    await this.loadOnchain();
  }

  async loadOffchainAndReceiver() {
    try {
      const response: any = await this.client.get(
        `api/v2/blockchain/wallet/balance`
      );

      if (response && response.addresses) {
        this.totalTokens = response.balance;
        response.addresses.forEach(address => {
          if (address.label === 'Offchain') {
            this.wallet.offchain.balance = address.balance;
          } else if (address.label === 'Receiver') {
            this.wallet.onchain.balance = address.balance;
            this.wallet.receiver.balance = address.balance;
            this.wallet.receiver.address = address.address;
          }
        });
      } else {
        console.error('No data');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async loadOnchain() {
    try {
      const address = await this.web3Wallet.getCurrentWallet();
      if (!address) {
        return;
      }

      this.wallet.onchain.address = address;
      if (this.wallet.receiver.address === address) {
        return; // don't re-add onchain balance to totalTokens
      }

      const onchainBalance = await this.tokenContract.balanceOf(address);
      this.wallet.onchain.balance = onchainBalance[0].toString();
      this.totalTokens = new BN(this.totalTokens).add(onchainBalance[0]);
    } catch (e) {
      console.log(e);
    }
  }

  async getEthAccount() {
    const address = await this.web3Wallet.getCurrentWallet();
    if (!address) {
      return;
    }
    this.wallet.eth.address = address;
    const ethBalance = await this.web3Wallet.getBalance(address);
    if (ethBalance) {
      this.wallet.eth.balance = ethBalance;
    }
  }

  async getStripeAccount() {
    const merchant = this.session.getLoggedInUser().merchant;
    if (merchant && merchant.service === 'stripe') {
      try {
        const stripeAccount = <any>(
          await this.client.get('api/v2/payments/stripe/connect')
        );
        if (stripeAccount && stripeAccount.totalBalance) {
          this.wallet.usd.value =
            stripeAccount.totalBalance.amount +
            stripeAccount.pendingBalance.amount;
        }
        return stripeAccount;
      } catch (e) {
        console.error(e);
      }
    } else {
      return;
    }
  }

  async getStripeTransactions() {
    try {
      const { transactions } = <any>(
        await this.client.get('api/v2/payments/stripe/transactions')
      );
      return transactions;
    } catch (e) {
      console.error(e);
    }
  }

  async hasMetamask(): Promise<boolean> {
    const isLocal: any = await this.web3Wallet.isLocal();
    return Boolean(isLocal);
  }

  // TODOOJM bucket endpoint needed
  getTokenChart(activeTimespan) {
    return fakeData.visualisation;
  }

  // TODOOJM tx/contribution endpoint needed
  getTokenTransactionTable() {
    return fakeData.token_transactions;
  }
}
