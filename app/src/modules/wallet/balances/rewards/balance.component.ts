import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Client } from '../../../../services/api/client';

@Component({
  moduleId: module.id,
  selector: 'm-wallet--balance-rewards',
  templateUrl: 'balance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletBalanceRewardsComponent implements OnInit {
  inProgress: boolean = false;
  balance: number = 0;

  constructor(protected client: Client, protected cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;
    this.detectChanges();

    try {
      let response: any = await this.client.get(`api/v2/blockchain/rewards/balance`);

      if (response && typeof response.balance !== 'undefined') {
        this.balance = response.balance;
      } else {
        console.error('No data');
        this.balance = 0;
      }
    } catch (e) {
      console.error(e);
      this.balance = 0;
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
