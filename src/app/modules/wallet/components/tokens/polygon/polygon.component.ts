import { Component, OnInit } from '@angular/core';
import { PolygonService } from './polygon.service';
import { first, map } from 'rxjs/operators';
import { RecordStatus } from './polygon.types';
import { NetworkSwitchService } from '../../../../../common/services/network-switch-service';

/**
 * Polygon component, giving users the ability to swap between networks.
 */
@Component({
  selector: 'm-wallet__polygon',
  templateUrl: 'polygon.component.html',
  styleUrls: ['./polygon.component.ng.scss'],
})
export class WalletPolygonComponent implements OnInit {
  public bridge = true;
  public waitingForNetwork = false;

  public pendingTxs = this.service.history$.pipe(
    map(txs => {
      return txs.filter(tx => tx.status === RecordStatus.ACTION_REQUIRED)
        .length;
    })
  );

  constructor(
    private service: PolygonService,
    private networkSwitch: NetworkSwitchService
  ) {}

  async ngOnInit() {
    await this.service.initialize();
    this.waitingForNetwork =
      this.networkSwitch.networkChanged$.getValue() !== 5;
    if (this.waitingForNetwork) {
      this.networkSwitch.switch(this.networkSwitch.networks.goerli.id);
    }
    this.networkSwitch.networkChanged$
      .pipe(first(chainId => chainId === 5))
      .subscribe(_ => (this.waitingForNetwork = false));
  }
}
