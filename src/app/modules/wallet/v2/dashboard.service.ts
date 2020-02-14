import { Injectable } from '@angular/core';
import { Client } from '../../../common/api/client.service';
import { Session } from '../../../services/session';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';
import toFriendlyCryptoVal from '../../../helpers/friendly-crypto';

export interface WalletCurrency {
  label: string;
  unit: string;
  balance: number;
  address: string | null;
}

export interface Wallet {
  tokens: WalletCurrency;
  offchain: WalletCurrency;
  onchain: WalletCurrency;
  receiver: WalletCurrency;
  cash: WalletCurrency;
  eth: WalletCurrency;
  btc: WalletCurrency;
}
@Injectable()
export class WalletDashboardService {
  walletLoaded = false;
  totalTokens = 0;
  wallet: Wallet = {
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
    cash: {
      label: 'Cash',
      unit: 'cash',
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

  async getWallet() {
    await this.getTokenAccounts();
    await this.getEthAccount();
    await this.getStripeAccount();

    this.walletLoaded = true;
    return this.wallet;
  }

  async getTokenAccounts() {
    const tokenTypes = ['tokens', 'onchain', 'offchain', 'receiver'];

    try {
      await this.loadOffchainAndReceiver();
      await this.loadOnchain();

      const tokenWallet = {};
      tokenTypes.forEach(type => {
        tokenWallet[type] = this.wallet[type];
      });
      return tokenWallet;
    } catch (e) {
      console.error(e);
      return e;
    }
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
      console.error(e);
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
        const { account } = <any>(
          await this.client.get('api/v2/payments/stripe/connect')
        );
        if (account) {
          this.wallet.cash.address = 'stripe';
          this.wallet.cash.balance =
            (account.totalBalance.amount - account.pendingBalance.amount) / 100;
          if (account.bankAccount) {
            const bankCurrency = account.bankAccount.currency;
            this.wallet.cash.label = bankCurrency.toUpperCase;
            this.wallet.cash.unit = bankCurrency;
          } else {
            // Has stripe account but not setup bank account
            const defaultCurrency = account.pendingBalance.currency;
            this.wallet.cash.label = defaultCurrency.toUpperCase;
            this.wallet.cash.unit = defaultCurrency;
          }
        }
        return account;
      } catch (e) {
        console.error(e);
        return;
      }
    } else {
      return;
    }
  }

  async createStripeAccount(form) {
    console.log('stripeform', form);
    try {
      const response = <any>(
        await this.client.put('api/v2/wallet/usd/account', form)
      );

      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async addStripeBank(form) {
    try {
      const response = <any>(
        await this.client.post('api/v2/payments/stripe/connect/bank', form)
      );
      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async removeStripeBank() {
    try {
      const response = <any>(
        await this.client.delete('api/v2/payments/stripe/connect/bank')
      );
      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async leaveMonetization() {
    try {
      const response = <any>(
        await this.client.delete('api/v2/payments/stripe/connect')
      );
      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async cancelStripeAccount() {
    try {
      const response = <any>(
        await this.client.delete('api/v2/payments/stripe/connect')
      );
      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async getStripeTransactions(offset) {
    try {
      const response = <any>(
        await this.client.get('api/v2/payments/stripe/transactions')
      );
      return response;

      // TODOOJM toggle fake data
      // return fakeData.tx_usd;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  async getStripePayouts() {
    try {
      const response = <any>(
        await this.client.get(
          'api/v1/monetization/service/analytics/list?offset=&limit=12&type=payouts'
        )
      );

      // TODOOJM toggle fake data
      return response.transactions;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  async getTokenChart(activeTimespanId) {
    const opts = {
      metric: 'token_balance',
      timespan: activeTimespanId,
    };
    try {
      const response = <any>(
        await this.client.get('api/v2/analytics/dashboards/token', opts)
      );
      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async getProEarnings() {
    try {
      const response = <any>(
        await this.client.get(
          'api/v2/analytics/dashboards/earnings?metric=earnings_total&timespan=today'
        )
      );

      const earnings =
        response.dashboard.metrics
          .find(m => m.id === 'earnings_total')
          .visualisation.segments[0].buckets.slice(-1)[0].value / 100;

      return earnings;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async getTokenTransactions(opts) {
    try {
      const response = <any>(
        await this.client.get(`api/v2/blockchain/transactions/ledger`, opts)
      );
      return response;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  async hasMetamask(): Promise<boolean> {
    const isLocal: any = await this.web3Wallet.isLocal();
    return Boolean(isLocal);
  }

  async canTransfer() {
    try {
      const response: any = await this.client.post(
        'api/v2/blockchain/transactions/can-withdraw'
      );
      if (!response) {
        return false;
      }
      return response.canWithdraw;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async web3WalletUnlocked() {
    await this.web3Wallet.ready();
    if (await this.web3Wallet.unlock()) {
      return true;
    } else {
      return false;
    }
  }

  async getDailyTokenContributionScores(dateRangeOpts) {
    try {
      const response: any = await this.client.post(
        'api/v2/blockchain/contributions',
        dateRangeOpts
      );
      if (!response.contributions) {
        return false;
      }
      return response;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
