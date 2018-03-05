import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../common/api/client.service';
import { WalletService } from '../../services/wallet';
import { BlockchainService } from '../blockchain/blockchain.service';


@Component({
  selector: 'm-wallet--points-overview',
  templateUrl: 'points-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PointsOverviewComponent {

  isLoading: boolean = false;
  currency: string = 'points';
  amount: string | number;

  constructor(public wallet: WalletService, private cd: ChangeDetectorRef, public blockchain: BlockchainService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.detectChanges();

    let requests = [
      this.wallet.getBalance(true).catch(() => false),
      //      this.blockchain.getBalance(true).catch(() => false)
    ];

    Promise.all(requests)
      .then((results : any) => {
        this.isLoading = false;

        if (results[1]) {
          this.currency = 'tokens';
          this.amount = results[1];
        } else {
          this.currency = 'points';
          //this.amount = results[0]; // not used
        }

        this.detectChanges();
      })
      .catch(e => {
        this.isLoading = false;
        this.detectChanges();
      });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
