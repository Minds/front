import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-walletBalance--tokens',
  templateUrl: './balance-tokens.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceTokensV2Component implements OnInit, OnDestroy {
  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session
  ) {}

  inProgress = true;
  protected updateTimer$;
  nextPayout;
  estimatedTokenPayout;
  totalBalance = {
    total: 123.345777892347923487,
    int: 123,
    frac: 345,
  };
  offchainBalance = {
    total: 1.34,
    int: 1,
    frac: 34,
  };
  onchainBalance = {
    total: 122,
    int: 122,
    frac: 0,
  };

  ngOnInit() {
    this.loadBalances();
    this.loadPayout();
    this.inProgress = false;
    this.updateTimer$ = setInterval(this.updateNextPayout.bind(this), 1000);
  }
  ngOnDestroy() {
    clearInterval(this.updateTimer$);
  }

  async loadBalances() {
    try {
      const result: any = await this.client.get(
        `api/v2/blockchain/contributions/overview`
      );

      // this.totalBalance = result. ;

      this.detectChanges();
    } catch (e) {
      console.error(e);
    }
  }
  async loadPayout() {
    try {
      const result: any = await this.client.get(
        `api/v2/blockchain/contributions/overview`
      );

      this.nextPayout = result.nextPayout;
      this.estimatedTokenPayout = result.currentReward;

      this.detectChanges();
    } catch (e) {
      console.error(e);
    }
  }

  updateNextPayout() {
    if (this.nextPayout) {
      this.nextPayout--;
      this.detectChanges();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  //get total balance () {
  // return total: #, int: #, dec: #
  // }

  //get offchain balance

  // get onchain balance

  // process all 3 balances
  // option a: ~~total will truncate??
  // option b: var num = (15.46974).toFixed(2) // returns str
}
