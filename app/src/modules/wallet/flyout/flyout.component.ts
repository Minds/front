import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../services/api';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { WalletService } from '../../../services/wallet';

@Component({
  selector: 'm-wallet--flyout',
  templateUrl: 'flyout.component.html'
})

export class WalletFlyoutComponent {

  address: string;
  balance: any = {
    points: -1,
    money: -1,
    tokens: -1
  };

  @Output('close') closeEvt: EventEmitter<any> = new EventEmitter();

  showAnnouncement = true;

  constructor(
    private router: Router,
    public client: Client,
    public wallet: WalletService,
    public blockchain: BlockchainService,
  ) {

  }

  ngOnInit() {
    this.loadBalances();
  }

  setUpCryptoWallet() {
    this.router.navigate(['/wallet/crypto/overview', { auto: 1 }]);
    this.address = void 0;
  }

  closeMessage() {
    this.showAnnouncement = false;
  }

  close() {
    this.closeEvt.emit(true);
  }

  loadBalances() {
    //TODO: return in one request?
    let requests = [
    //this.client.get('api/v1/monetization/revenue/overview').catch(() => false),
      this.wallet.getBalance(true).catch(() => false),
      this.blockchain.getBalance(true).catch(() => false)
    ];

    Promise.all(requests)
      .then((results: Array<any>) => {
        if (results[0]) {
          this.balance.points = results[0].balance;
        }

        if (results[1] !== false) {
          this.balance.tokens = results[2];
        }

        this.balance.points = this.wallet.points;

        this.balance = Object.assign({}, this.balance);

        // this.hasMoney = results[0] !== false;
        // this.hasTokens = results[2] !== false;
        // this.ready = true;
      });
  }

}
