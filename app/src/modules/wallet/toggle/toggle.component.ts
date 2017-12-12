import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Client } from '../../../services/api';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { WalletService } from '../../../services/wallet';
import { animations } from '../../../animations';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'm-wallet--topbar-toggle',
  templateUrl: 'toggle.component.html',
  animations: animations
})

export class WalletTopbarToggleComponent {
  @Input() item: any;
  toggled: boolean = false;
  balance: any = {points: 0, money: 0, tokens: 0};
  address: string;


  constructor(public client: Client,
              public wallet: WalletService,
              public blockchain: BlockchainService,
              protected web3Wallet: Web3WalletService) {
    this.load();
    this.getTotals();
  }

  async load() {
    await this.web3Wallet.ready();

    let coinbase = await this.web3Wallet.getWallets();

    if (coinbase && coinbase.length && !await this.blockchain.getWallet()) {
      const providerName = this.web3Wallet.getProviderName();
      this.address = `${providerName} (${coinbase[0]})`;
      this.toggled = true;
    }
  }

  getTotals() {
    let requests = [
      this.client.get('api/v1/monetization/revenue/overview').catch(() => false),
      this.wallet.getBalance(true).catch(() => false),
      this.blockchain.getBalance(true).catch(() => false)
    ];

    Promise.all(requests)
      .then((results: Array<any>) => {
        if (results[0]) {
          this.balance.points = results[0].balance;
        }

        if (results[2] !== false) {
          this.balance.tokens = results[2];
        }

        this.balance.points = this.wallet.points;

        this.balance = Object.assign({}, this.balance);

        // this.hasMoney = results[0] !== false;
        // this.hasTokens = results[2] !== false;

        // this.ready = true;
      });
  }

  toggle(e) {
    this.getTotals();
    this.toggled = !this.toggled;
  }
}