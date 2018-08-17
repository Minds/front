import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api/client';

@Component({
  selector: 'm-wallet-token--testnet',
  templateUrl: 'testnet.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class WalletTokenTestnetComponent {
  offchainBalance: number = 0;
  inProgress: boolean = false;

  user = window.Minds.user;

  constructor(
    public session: Session,
    private client: Client,
    private cd: ChangeDetectorRef
  ) {
    this.loadBalance();
  }

  async loadBalance() {
    this.inProgress = true;
    // this.detectChanges();

    try {
      let response: any = await this.client.get(`api/v2/blockchain/wallet/balance`);

      if (response) {
        this.offchainBalance = response.addresses[1].balance;
      } else {
        console.error('No data');
        this.offchainBalance = 0;
      }
    } catch (e) {
      console.error(e);
      this.offchainBalance = 0;
    } finally {
      this.inProgress = false;
      // this.detectChanges();
    }
  }

  // detectChanges() {
  //   this.cd.markForCheck();
  //   this.cd.detectChanges();
  // }
}