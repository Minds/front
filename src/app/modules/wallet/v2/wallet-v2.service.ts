import { Injectable, Optional } from '@angular/core';
import { Client } from '../../../common/api/client.service';
import { Session } from '../../../services/session';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';
import toFriendlyCryptoVal from '../../../helpers/friendly-crypto';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SplitBalance {
  total: number;
  int: number;
  frac: number | null;
}

export interface StripeDetails {
  bankAccount?: any;
  totalBalance?: any;
  pendingBalance?: { amount: number };
  pendingBalanceSplit: SplitBalance;
  totalPaidOutSplit: SplitBalance;
  hasAccount: boolean;
  hasBank: boolean;
  verified: boolean;
}

export interface WalletCurrency {
  label: string;
  unit: string;
  balance: number;
  address: string | null;
  stripeDetails?: StripeDetails;
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
export class WalletV2Service {
  readonly basePath: string = '/wallet/canary';

  totalTokens = 0;
  stripeDetails: StripeDetails;

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

  wallet$: BehaviorSubject<Wallet> = new BehaviorSubject(this.wallet);

  constructor(
    private client: Client,
    protected web3Wallet: Web3WalletService,
    protected tokenContract: TokenContractService,
    protected session: Session
  ) {}

  async loadWallet(): Promise<void> {
    this.getTokenAccounts();
    this.getEthAccount();
    this.loadStripeAccount();

    this.wallet$.next(this.wallet);
  }

  async getTokenAccounts(): Promise<any> {
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

  async loadOffchainAndReceiver(): Promise<Wallet> {
    try {
      const response: any = await this.client.get(
        `api/v2/blockchain/wallet/balance`
      );

      if (response && response.addresses) {
        this.totalTokens = toFriendlyCryptoVal(response.balance);
        this.wallet.tokens.balance = toFriendlyCryptoVal(response.balance);
        response.addresses.forEach(address => {
          if (address.address === 'offchain') {
            this.wallet.offchain.balance = toFriendlyCryptoVal(address.balance);
          } else if (address.label === 'Receiver') {
            this.wallet.onchain.balance = toFriendlyCryptoVal(address.balance);
            this.wallet.receiver.balance = toFriendlyCryptoVal(address.balance);
            this.wallet.receiver.address = address.address;
          }
        });
        this.wallet$.next(this.wallet);
        return this.wallet;
      } else {
        console.error('No data');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async loadOnchain(): Promise<void> {
    try {
      const address = await this.web3Wallet.getCurrentWallet();
      if (!address) {
        return;
      }

      this.wallet.onchain.address = address;
      if (this.wallet.receiver.address === address) {
        this.wallet$.next(this.wallet);
        return; // don't re-add onchain balance to totalTokens
      }

      const onchainBalance = await this.tokenContract.balanceOf(address);
      this.wallet.onchain.balance = toFriendlyCryptoVal(
        onchainBalance[0].toString()
      );
      this.wallet.tokens.balance += toFriendlyCryptoVal(
        this.wallet.onchain.balance
      );
      this.wallet$.next(this.wallet);
    } catch (e) {
      console.error(e);
    }
  }

  async getEthAccount(): Promise<WalletCurrency> {
    try {
      const address = await this.web3Wallet.getCurrentWallet();
      if (address) {
        this.wallet.eth.address = address;
        const ethBalance = await this.web3Wallet.getBalance(address);
        if (ethBalance) {
          this.wallet.eth.balance = toFriendlyCryptoVal(ethBalance);
        }
      }
      return this.wallet.eth;
    } catch (e) {
      console.error(e);
    }
  }

  async loadStripeAccount(): Promise<StripeDetails> {
    try {
      let { account } = <any>(
        await this.client.get('api/v2/payments/stripe/connect')
      );
      this.setStripeAccount(account);
    } catch (e) {
      this.setStripeAccount(null);
    }
    return this.wallet.cash.stripeDetails;
  }

  setStripeAccount(@Optional() account: StripeDetails): void {
    const merchant = this.session.getLoggedInUser().merchant;
    const zeroSplit = this.splitBalance(0);

    this.stripeDetails = {
      hasAccount: false,
      hasBank: false,
      pendingBalanceSplit: zeroSplit,
      totalPaidOutSplit: zeroSplit,
      verified: false,
    };

    //merchant && merchant.service === 'stripe'
    if (account) {
      this.stripeDetails.hasAccount = true;
      this.stripeDetails.verified = account.verified;

      this.wallet.cash.address = 'stripe';
      if (account.totalBalance && account.pendingBalance) {
        this.wallet.cash.balance =
          (account.totalBalance.amount - account.pendingBalance.amount) / 100;
        this.stripeDetails.pendingBalanceSplit = this.splitBalance(
          account.pendingBalance.amount / 100
        );
        this.stripeDetails.totalPaidOutSplit = this.splitBalance(
          (account.totalBalance.amount - account.pendingBalance.amount) / 100
        );
      } else {
        this.wallet.cash.balance = 0;
      }

      if (account.bankAccount) {
        const bankCurrency: string = account.bankAccount.currency;
        this.wallet.cash.label = bankCurrency.toUpperCase();
        this.wallet.cash.unit = bankCurrency;
        this.stripeDetails.hasBank = true;
      }

      this.stripeDetails = { ...account, ...this.stripeDetails };

      this.wallet.cash.stripeDetails = this.stripeDetails;
    } else {
      this.wallet.cash.stripeDetails = this.stripeDetails;
    }

    this.wallet$.next(this.wallet);
  }

  async createStripeAccount(form): Promise<void> {
    const response = <any>(
      await this.client.put('api/v2/wallet/usd/account', form)
    );

    if (!this.session.getLoggedInUser().programs) {
      this.session.getLoggedInUser().programs = [];
    }
    this.session.getLoggedInUser().programs.push('affiliate');

    this.session.getLoggedInUser().merchant = {
      id: response.account.id,
      service: 'stripe',
    };

    this.setStripeAccount(response.account);
  }

  async addStripeBank(form) {
    const response = <any>(
      await this.client.post('api/v2/payments/stripe/connect/bank', form)
    );

    // Refresh the account
    await this.loadStripeAccount();

    return response;
  }

  async removeStripeBank() {
    const response = <any>(
      await this.client.delete('api/v2/payments/stripe/connect/bank')
    );

    return response;
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

      // return fakeData.tx_usd;
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
    const opts = {
      metric: 'earnings_total',
      timespan: 'today',
    };
    try {
      const response = <any>(
        await this.client.get('api/v2/analytics/dashboards/earnings', opts)
      );

      const earningsBuckets = response.dashboard.metrics.find(
        m => m.id === 'earnings_total'
      ).visualisation.segments[0].buckets;

      if (earningsBuckets && earningsBuckets.length) {
        return earningsBuckets.slice(-1)[0].value / 100;
      } else {
        return 67.55;
      }
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
      const response: any = await this.client.get(
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

  onOnchainAddressChange(): void {
    this.loadWallet();
  }

  // Returns an object with separated dollars and cents
  // as well as the original total
  public splitBalance(balance): SplitBalance {
    const splitBalance: SplitBalance = {
      total: balance,
      int: 0,
      frac: null,
    };

    const balanceArray = balance.toString().split('.');

    splitBalance.int = balanceArray[0];
    if (balanceArray[1]) {
      splitBalance.frac = balanceArray[1].slice(0, 2);
    }

    return splitBalance;
  }
}
