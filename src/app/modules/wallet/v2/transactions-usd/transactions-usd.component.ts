import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import { WalletDashboardService } from '../dashboard.service';

import * as moment from 'moment';

@Component({
  selector: 'm-walletTransactions--usd',
  templateUrl: './transactions-usd.component.html',
})
export class WalletTransactionsUsdComponent implements OnInit {
  init: boolean = false;
  inProgress: boolean = true;
  offset: string;
  moreData: boolean = true;

  transactions: any[] = [];
  runningTotal: number = 0;
  currentDayInLoop = moment();

  filterApplied: boolean = false;

  showPendingPayoutPopup: boolean = false;

  constructor(
    protected client: Client,
    protected web3Wallet: Web3WalletService,
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected route: ActivatedRoute,
    protected session: Session,
    protected walletService: WalletDashboardService
  ) {}

  ngOnInit() {
    this.getStripeAccount();
  }

  async getStripeAccount() {
    const stripeAccount = await this.walletService.getStripeAccount();
    if (!stripeAccount) {
      return;
    } else {
      this.runningTotal =
        (stripeAccount.totalBalance.amount -
          stripeAccount.pendingBalance.amount) /
        100;
    }
    this.load(true);
  }

  async load(refresh: boolean) {
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

      if (refresh) {
        this.transactions = [];
      }

      if (response) {
        if (response && response.transactions) {
          this.formatResponse(response.transactions);
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

  formatResponse(transactions) {
    transactions.forEach(tx => {
      const formattedTx: any = {};

      formattedTx.amount = tx.amount / 100;

      if (tx.type !== 'payout') {
        this.runningTotal -= formattedTx.amount;
      } else {
        this.runningTotal = 0;
      }
      formattedTx.runningTotal = this.runningTotal;

      formattedTx.timestamp = tx.timestamp;
      formattedTx.type = tx.type;
      formattedTx.superType = tx.type;

      if (formattedTx.superType === 'payout') {
        formattedTx.showRewardsPopup = false;
      }

      if (formattedTx.superType === 'wire') {
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
    const isSender = false,
      user = tx.customer_user;

    return {
      avatar: `/icon/${user.guid}/medium/${user.icontime}`,
      username: user.username,
      isSender,
    };
  }

  getDelta(tx) {
    let delta = 'neutral';
    if (tx.type !== 'payout') {
      delta = tx.amount < 0 ? 'negative' : 'positive';
    }
    return delta;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
//   init: boolean = false;
//   inProgress;
//   moreData: boolean = true;
//   offset;

//   stripeAccount;
//   transactions;
//   transactionsRaw;
//   pendingTransactions = [];

//   currentDayInLoop = moment();
//   proEarningsChannelGuid = '930229554033729554';
//   runningTotal: number = 0;
//   lastPayoutMoment;
//   showPendingPayoutPopup: boolean = false;

//   filter: Filter = {
//     id: 'type',
//     label: 'Transaction Type',
//     // description: '',
//     options: [
//       {
//         id: 'all',
//         label: 'All',
//         // description: '',
//       },
//       {
//         id: 'payments',
//         label: 'Wires', // TODO change to "Payments" when Minds Pay is ready
//         // description: '',
//       },
//       {
//         id: 'pro_earnings',
//         label: 'Pro Earnings',
//         // description: '',
//       },
//       {
//         id: 'payouts',
//         label: 'Payouts',
//         // description: '',
//       },
//     ],
//   };

//   constructor(protected walletService: WalletDashboardService) {}

//   ngOnInit() {
//     this.getStripeAccount();

//     this.init = true;
//   }
//   async getStripeAccount() {
//     this.stripeAccount = await this.walletService.getStripeAccount();

//     if (!this.stripeAccount) {
//       return;
//     } else {
//       this.runningTotal =
//         (this.stripeAccount.totalBalance.amount -
//           this.stripeAccount.pendingBalance.amount) /
//         100;
//       // This assumes everyone gets paid on the last day of the month
//       this.lastPayoutMoment = moment()
//         .subtract(1, 'months')
//         .endOf('month');
//     }
//     this.load(true);
//   }

//   async load(refresh: boolean) {
//     if (this.inProgress && !refresh) {
//       return;
//     }

//     if (refresh) {
//       this.transactions = [];
//       this.offset = '';
//       this.moreData = true;
//     }

//     this.inProgress = true;
//     // this.detectChanges();

//     if (refresh) {
//       // TODOOJM figure out how to filter in template, without using transactionsRaw
//       this.transactionsRaw = [];
//       this.transactions = [];
//     }

//     const response: any = await this.walletService.getStripeTransactions(
//       this.offset
//     );
//     console.log(response);

//     if (response && response.transactions) {
//       this.formatResponse(response.transactions);
//       if (response['load-next']) {
//         this.offset = response['load-next'];
//       } else {
//         console.error('No data');
//         this.moreData = false;
//         this.inProgress = false;
//       }
//     }
//   }

//   // FORMAT RESPONSE - USD
//   formatResponse(response) {
//     response.forEach(tx => {
//       const formattedTx: any = {};
//       const txMoment = moment(tx.timestamp * 1000);
//       const txAmount = tx.gross / 100;

//       this.runningTotal -= txAmount;
//       formattedTx.runningTotal = this.runningTotal;
//       formattedTx.displayDate = null;
//       formattedTx.displayTime = txMoment.format('hh:mm a');
//       formattedTx.amount = txAmount;

//       // TODOOJM this will be either from/to for tokens table
//       formattedTx.direction = 'from';

//       // TODOOJM once I can confirm structure of sample 'payout' response, include delta = 'neutral' for blue arrow;
//       formattedTx.delta =
//         tx.transaction_type === 'payout' ? 'neutral' : 'positive';

//       formattedTx.type = tx.transaction_type;

//       if (this.isNewDay(this.currentDayInLoop, txMoment)) {
//         this.currentDayInLoop = txMoment;

//         // check if yesterday
//         const yesterday = moment().subtract(1, 'day');
//         if (txMoment.isSame(yesterday, 'day')) {
//           formattedTx.displayDate = 'Yesterday';
//         } else {
//           formattedTx.displayDate = moment(txMoment).format('ddd MMM Do');
//         }
//       }
//       // check if pending
//       if (txMoment.isBefore(this.lastPayoutMoment)) {
//         this.transactionsRaw.push(formattedTx);
//       } else {
//         this.pendingTransactions.push(formattedTx);
//       }

//       this.transactions.push(...this.transactionsRaw);
//     });
//     this.inProgress = false;
//   }

//   // UTILITIES
//   isNewDay(moment1, moment2) {
//     return !moment1.isSame(moment2, 'day');
//   }

//   // TODOOJM remove this. no filter anymore
//   filterSelected($event) {
//     const txType: string = $event.option.id;
//     if (txType === 'all') {
//       this.transactions = this.transactionsRaw;
//     } else {
//       this.transactions = this.transactionsRaw.filter(tx => {
//         return tx.type === txType;
//       });
//     }
//   }
// }

//////////////////////////////////////////////////////
//   loading: boolean = true;
//   stripeAccount: any;
//   transactionsRaw: Array<any> = [];
//   transactions: any;
//   pendingTransactions: any = [];
//   runningTotal: number = 0;
//   lastPayoutMoment; // TODOOJM confirm payout happens at the end of the day
//   currentDayInLoop = moment();
//   proEarningsChannelGuid = '930229554033729554';

// constructor(protected walletService: WalletDashboardService) {}

// ngOnInit() {
// this.lastPayoutMoment = moment()
//   .subtract(1, 'months')
//   .endOf('month');
// this.load();
// }
//   async load() {
//     this.loading = true;
//     this.getAccount();
//     this.getTransactions();
//     this.loading = false;
//   }

//   async getAccount() {
//     try {
//       const response: any = await this.walletService.getStripeAccount();
//       console.log(response);
//       this.runningTotal =
//         (response.totalBalance.amount - response.pendingBalance.amount) / 100;
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   // async getTransactions() {
//   //   try {
//   //     const response: any = await this.walletService.getStripeTransactions('');
//   //     this.formatResponse(response);
//   //   } catch (e) {
//   //     console.error(e);
//   //     this.transactions = null;
//   //   }
//   // }

//   formatResponse(response: any) {
//     response.forEach(tx => {
//       const formattedTx: any = {};
//       const txMoment = moment(tx.timestamp * 1000);
//       const txAmount = tx.gross / 100;

//       this.runningTotal -= txAmount;
//       formattedTx.runningTotal = this.runningTotal;
//       formattedTx.displayDate = null;
//       formattedTx.displayTime = txMoment.format('hh:mm a');
//       formattedTx.amount = txAmount;

//       // TODOOJM this will be either from/to for tokens table
//       formattedTx.direction = 'from';

//       // TODOOJM once I can confirm structure of sample 'payout' response, include delta = 'neutral' for blue arrow;
//       formattedTx.delta = 'positive';
//       // TODOOJM use positive/negative/neutral for tokens
//       // formattedTx.deltaType = txAmount < 0 ? 'debit' : 'credit';

//       formattedTx.type = 'payouts';

//       if (this.isNewDay(this.currentDayInLoop, txMoment)) {
//         this.currentDayInLoop = txMoment;

//         // check if yesterday
//         const yesterday = moment().subtract(1, 'day');
//         if (txMoment.isSame(yesterday, 'day')) {
//           formattedTx.displayDate = 'Yesterday';
//         } else {
//           formattedTx.displayDate = moment(txMoment).format('ddd MMM Do');
//         }
//       }
//       // check if pending
//       if (txMoment.isBefore(this.lastPayoutMoment)) {
//         this.transactionsRaw.push(formattedTx);
//       } else {
//         this.pendingTransactions.push(formattedTx);
//       }

//       // TODOOJM do this differently in tokens table bc paging
//       this.transactions = this.transactionsRaw;
//     });
//   }

//   isNewDay(moment1, moment2) {
//     return !moment1.isSame(moment2, 'day');
//   }

//   filterSelected($event) {
//     const txType: string = $event.option.id;
//     if (txType === 'all') {
//       this.transactions = this.transactionsRaw;
//     } else {
//       this.transactions = this.transactionsRaw.filter(tx => {
//         return tx.type === txType;
//       });
//     }
//   }
// }
