import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import {
  WalletV2Service,
  WalletCurrency,
  StripeDetails,
} from '../../wallet-v2.service';

import * as moment from 'moment';

/**
 * List of cash-related transactions.
 *
 * See it in wallet > cash > transactions
 */
@Component({
  selector: 'm-walletTransactions--cash',
  templateUrl: './transactions-cash.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTransactionsCashComponent implements OnInit {
  init: boolean = false;
  inProgress: boolean = false;
  offset: string;
  moreData: boolean = true;
  currency: string = 'USD';

  transactions: any[] = [];
  runningTotal: number = 0;
  previousTxAmount: number = 0;
  currentDayInLoop = moment();

  filterApplied: boolean = false;

  showRewardsPopup: boolean = false;

  constructor(
    protected client: Client,
    protected web3Wallet: Web3WalletService,
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected route: ActivatedRoute,
    protected session: Session,
    protected walletService: WalletV2Service
  ) {}

  ngOnInit() {
    //if (this.walletService.wallet.cash.address) {
    this.getStripeAccount();
    //this.init = true;
    // } else {
    //   this.init = true;
    // }
    this.detectChanges();
  }

  async getStripeAccount() {
    try {
      const account: StripeDetails = await this.walletService.loadStripeAccount();
      if (account) {
        if (account.bankAccount) {
          this.currency = account.bankAccount.currency.toUpperCase();
        }

        this.runningTotal = account.pendingBalance.amount / 100;
        await this.loadTransactions(true);
      }
    } catch (e) {
      console.error(e);
      this.moreData = false;
    } finally {
      this.init = true;
      this.inProgress = false;
      this.detectChanges();
    }
  }

  async loadTransactions(refresh: boolean) {
    if (this.inProgress && !refresh) {
      return;
    }

    if (refresh) {
      this.transactions = [];
      this.offset = '';
      this.moreData = true;
    }

    this.inProgress = true;
    this.detectChanges();

    try {
      const opts: any = {
        offset: this.offset,
      };

      const response: any = await this.walletService.getStripeTransactions(
        opts
      );

      if (response) {
        console.log(response.transactions);
        if (response.transactions) {
          this.formatResponse(response.transactions, refresh);
        }

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
          this.inProgress = false;
        }
      } else {
        console.error('No data');
        this.moreData = false;
        this.inProgress = false;
      }
    } catch (e) {
      console.error(e);
      this.moreData = false;
    } finally {
      this.init = true;
      this.inProgress = false;
      this.detectChanges();
    }
  }

  formatResponse(transactions, refresh: boolean) {
    transactions.forEach((tx, i) => {
      const formattedTx: any = { ...tx };

      formattedTx.superType = tx.type;

      formattedTx.amount = tx.net / 100;

      if (i !== 0 || !refresh) {
        this.runningTotal -= this.previousTxAmount;
      }
      this.previousTxAmount = formattedTx.amount;

      formattedTx.runningTotal = this.walletService.splitBalance(
        this.runningTotal
      );

      if (formattedTx.superType === 'payout') {
        formattedTx.showRewardsPopup = false;
      }

      if (
        formattedTx.superType === 'wire' ||
        formattedTx.superType === 'supermind'
      ) {
        formattedTx.otherUser = this.getOtherUser(tx);
      }

      formattedTx.delta = this.getDelta(tx);

      const txMoment = moment(tx.timestamp * 1000).local();
      formattedTx.displayDate = null;
      formattedTx.displayTime = txMoment.format('hh:mm a');

      if (this.isNewDay(this.currentDayInLoop, txMoment)) {
        this.currentDayInLoop = txMoment;

        // If tx occured yesterday, use 'yesterday' instead of date
        const yesterday = moment().subtract(1, 'day');
        if (txMoment.isSame(yesterday, 'day')) {
          formattedTx.displayDate = 'Yesterday';
        } else {
          formattedTx.displayDate = moment(txMoment).format('ddd MMM Do');
        }
      }
      this.transactions.push(formattedTx);
    });
    this.inProgress = false;
  }

  isNewDay(moment1, moment2) {
    return !moment1.isSame(moment2, 'day');
  }

  getOtherUser(tx) {
    const isSender = true,
      user = tx.customer_user;

    if (!user) {
      return null;
    }

    return {
      avatar: `/icon/${user.guid}/medium/${user.icontime}`,
      username: user.username,
      isSender,
    };
  }

  getDelta(tx) {
    let delta = 'neutral';
    if (tx.type !== 'payout') {
      delta = tx.net < 0 ? 'negative' : 'positive';
    }
    return delta;
  }

  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}
