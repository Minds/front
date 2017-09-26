import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../common/api/client.service';
import { WalletService } from '../../services/wallet';


@Component({
  selector: 'm-wallet--points-overview',
  templateUrl: 'points-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PointsOverviewComponent {

  constructor(public wallet: WalletService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.wallet.getBalance(true)
      .then(() => {
        this.cd.markForCheck();
        this.cd.detectChanges();
      });
  }

}
