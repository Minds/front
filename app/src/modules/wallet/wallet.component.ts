import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Storage } from '../../services/storage';
import { Client } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { SessionFactory } from '../../services/session';

import { WalletService } from '../../services/wallet';
import { BlockchainService } from '../blockchain/blockchain.service';


@Component({
  moduleId: module.id,
  selector: 'm-wallet',
  templateUrl: 'wallet.component.html'
})

export class WalletComponent {

  session = SessionFactory.build();

  points: Number = 0;
  transactions: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;

  disablePointsAnimation: boolean = false;

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
    public title: MindsTitle,
    public storage: Storage,
    public blockchain: BlockchainService
  ) {
    this.disablePointsAnimation = !!this.storage.get('disablePointsAnimation');
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.title.setTitle('Wallet');

    this.getTotals();
  }

  getTotals() {
    let requests = [
      this.client.get('api/v1/monetization/revenue/overview').catch(() => false),
      this.wallet.getBalance(true).catch(() => false),
      this.blockchain.getBalance(true).catch(() => false)
    ];

    Promise.all(requests)
      .then(results => {
        if (results[0]) {
          this.currency = results[0].currency;
          this.balance = results[0].balance;
          this.payouts = results[0].payouts
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

  // Animations
  setDisablePointsAnimation(value) {
    this.disablePointsAnimation = !!value;
    this.storage.set('disablePointsAnimation', !!value ? '1' : '');
  }
}
