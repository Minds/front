import { Component, OnInit } from '@angular/core';
import { Filter } from '../../../../interfaces/dashboard';
import { WalletDashboardService } from '../dashboard.service';
import * as moment from 'moment';

@Component({
  selector: 'm-walletTransactions--usd',
  templateUrl: './transactions-usd.component.html',
})
export class WalletTransactionsUsdComponent implements OnInit {
  init: boolean = false;
  inProgress;
  moreData: boolean = true;
  offset;

  stripeAccount;
  transactions;
  transactionsRaw;
  pendingTransactions = [];

  currentDayInLoop = moment();
  proEarningsChannelGuid = '930229554033729554';
  runningTotal: number = 0;
  lastPayoutMoment;

  filter: Filter = {
    id: 'type',
    label: 'Transaction Type',
    // description: '',
    options: [
      {
        id: 'all',
        label: 'All',
        // description: '',
      },
      {
        id: 'payments',
        label: 'Wires', // TODO change to "Payments" when Minds Pay is ready
        // description: '',
      },
      {
        id: 'pro_earnings',
        label: 'Pro Earnings',
        // description: '',
      },
      {
        id: 'payouts',
        label: 'Payouts',
        // description: '',
      },
    ],
  };

  constructor(protected walletService: WalletDashboardService) {}

  ngOnInit() {
    this.getStripeAccount();

    this.init = true;
  }
  async getStripeAccount() {
    this.stripeAccount = await this.walletService.getStripeAccount();

    if (!this.stripeAccount) {
      return;
    } else {
      this.runningTotal =
        (this.stripeAccount.totalBalance.amount -
          this.stripeAccount.pendingBalance.amount) /
        100;
      // This assumes everyone gets paid on the last day of the month
      this.lastPayoutMoment = moment()
        .subtract(1, 'months')
        .endOf('month');
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
    // this.detectChanges();

    if (refresh) {
      // TODOOJM figure out how to filter in template, without using transactionsRaw
      this.transactionsRaw = [];
      this.transactions = [];
    }

    const response: any = await this.walletService.getStripeTransactions(
      this.offset
    );
    console.log(response);

    if (response && response.transactions) {
      this.formatResponse(response.transactions);
      if (response['load-next']) {
        this.offset = response['load-next'];
      } else {
        console.error('No data');
        this.moreData = false;
        this.inProgress = false;
      }
    }
  }

  // FORMAT RESPONSE - USD
  formatResponse(response) {
    response.forEach(tx => {
      const formattedTx: any = {};
      const txMoment = moment(tx.timestamp * 1000);
      const txAmount = tx.gross / 100;

      this.runningTotal -= txAmount;
      formattedTx.runningTotal = this.runningTotal;
      formattedTx.displayDate = null;
      formattedTx.displayTime = txMoment.format('hh:mm a');
      formattedTx.amount = txAmount;

      // TODOOJM this will be either from/to for tokens table
      formattedTx.direction = 'from';

      // TODOOJM once I can confirm structure of sample 'payout' response, include delta = 'neutral' for blue arrow;
      formattedTx.delta =
        tx.transaction_type === 'payout' ? 'neutral' : 'positive';

      formattedTx.type = tx.transaction_type;

      if (this.isNewDay(this.currentDayInLoop, txMoment)) {
        this.currentDayInLoop = txMoment;

        // check if yesterday
        const yesterday = moment().subtract(1, 'day');
        if (txMoment.isSame(yesterday, 'day')) {
          formattedTx.displayDate = 'Yesterday';
        } else {
          formattedTx.displayDate = moment(txMoment).format('ddd MMM Do');
        }
      }
      // check if pending
      if (txMoment.isBefore(this.lastPayoutMoment)) {
        this.transactionsRaw.push(formattedTx);
      } else {
        this.pendingTransactions.push(formattedTx);
      }

      this.transactions.push(...this.transactionsRaw);
    });
    this.inProgress = false;
  }

  // UTILITIES
  isNewDay(moment1, moment2) {
    return !moment1.isSame(moment2, 'day');
  }

  // TODOOJM remove this. no filter anymore
  filterSelected($event) {
    const txType: string = $event.option.id;
    if (txType === 'all') {
      this.transactions = this.transactionsRaw;
    } else {
      this.transactions = this.transactionsRaw.filter(tx => {
        return tx.type === txType;
      });
    }
  }
}

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
