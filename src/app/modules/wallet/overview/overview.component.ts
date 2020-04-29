import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { Storage } from '../../../services/storage';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

import { WalletService } from '../../../services/wallet';
import { BlockchainService } from '../../blockchain/blockchain.service';

@Component({
  selector: 'm-wallet--overview',
  templateUrl: 'overview.component.html',
})
export class WalletOverviewComponent {
  type: string = '';
  togglePurchase: boolean = false;
  paramsSubscription: Subscription;

  points: Number = 0;
  transactions: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;

  currency: string = 'usd';
  balance: number | string = 0;
  payouts: number | string = 0;
  net: number | string = 0;
  ready: boolean = false;

  filter: string = 'payments';

  tokens: any;

  hasTokens: boolean = false;
  hasMoney: boolean = false;

  overviewColSize: number;

  constructor(
    public client: Client,
    public wallet: WalletService,
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public blockchain: BlockchainService,
    private session: Session
  ) {}

  ngOnInit() {
    this.type = 'points';

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['type']) {
        this.type = params['type'];
      }
      if (params['stub'] && params['stub'] === 'purchase') {
        this.togglePurchase = true;
      }
    });

    this.route.url.subscribe(url => {
      if (url[0].path === 'purchase') this.togglePurchase = true;
    });

    this.getTotals();
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  getTotals() {
    let requests = [
      this.client
        .get('api/v1/monetization/revenue/overview')
        .catch(() => false),
      this.wallet.getBalance(true).catch(() => false),
      this.blockchain.getBalance(true).catch(() => false),
    ];

    Promise.all(requests).then(results => {
      if (results[0]) {
        this.currency = results[0].currency;
        this.balance = results[0].balance;
        this.payouts = results[0].payouts;
        this.net = results[0].total.net;
      }

      if (results[2] !== false) {
        this.tokens = results[2];
      }

      this.hasMoney = results[0] !== false;
      this.hasTokens = results[2] !== false;

      this.overviewColSize = 4;

      if (!this.hasMoney && !this.hasTokens) {
        this.overviewColSize = 12;
      } else if (!this.hasMoney || !this.hasTokens) {
        this.overviewColSize = 6;
      }

      this.ready = true;
    });
  }

  getCurrencySymbol(currency) {
    switch (currency) {
      case 'gbp':
        return '£';
      case 'eur':
        return '€';
      case 'usd':
      default:
        return '$';
    }
  }
}
