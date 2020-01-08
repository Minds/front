import { Injectable } from '@angular/core';
import { Client } from '../../../common/api/client.service';
import { Session } from '../../../services/session';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';
import { BehaviorSubject, Observable } from 'rxjs';
import toFriendlyCryptoVal from '../../../helpers/friendly-crypto';

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

  // TODOOJM: make wallet an observable and have the dashboard component subscribe to it
  getWallet() {
    this.getTokenAccounts();
    this.getEthAccount();
    this.getStripeAccount();

    const test1 = toFriendlyCryptoVal('123456789012345678');
    const test2 = toFriendlyCryptoVal('1234567890123456789999');
    const test3 = toFriendlyCryptoVal('12345678901234567');

    // TODOOJM toggle me before pushing
    this.wallet = fakeData.wallet;

    // TODOOJM remove
    console.log('********');
    console.log(this.wallet);
    console.log('********');

    this.walletLoaded = true;

    return this.wallet;
  }

  async getTokenAccounts() {
    await this.loadOffchainAndReceiver();
    await this.loadOnchain();
    const tokenTypes = ['tokens', 'onchain', 'offchain', 'receiver'];

    const tokenWallet = {};
    tokenTypes.forEach(type => {
      tokenWallet[type] = this.wallet[type];
    });
    return tokenWallet;
  }

  async loadOffchainAndReceiver() {
    try {
      const response: any = await this.client.get(
        `api/v2/blockchain/wallet/balance`
      );

      if (response && response.addresses) {
        this.totalTokens = toFriendlyCryptoVal(response.balance);
        response.addresses.forEach(address => {
          if (address.label === 'Offchain') {
            this.wallet.offchain.balance = toFriendlyCryptoVal(address.balance);
          } else if (address.label === 'Receiver') {
            this.wallet.onchain.balance = toFriendlyCryptoVal(address.balance);
            this.wallet.receiver.balance = toFriendlyCryptoVal(address.balance);
            this.wallet.receiver.address = address.address;
          }
        });
        return this.wallet;
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
      this.wallet.onchain.balance = toFriendlyCryptoVal(
        onchainBalance[0].toString()
      );
      this.wallet.tokens.balance += toFriendlyCryptoVal(
        this.wallet.onchain.balance
      );
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
      this.wallet.eth.balance = toFriendlyCryptoVal(ethBalance);
    }
    return this.wallet.eth;
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
            (stripeAccount.totalBalance.amount +
              stripeAccount.pendingBalance.amount) *
            100;
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

  getTokenTransactionTable() {
    // TODOOJM get this from token transactions component
    return fakeData.token_transactions;
  }
}
