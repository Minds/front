import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  NetworkSwitchService,
  Network,
} from '../../../../../common/services/network-switch-service';
import { map } from 'rxjs/operators';

// tabs for different components that can be shown
export type SkaleBridgeSubTab =
  | 'bridge'
  | 'skale-bridge'
  | 'community-pool'
  | 'faucet';

/**
 * Wrapper for SKALE transfer bridge that allows access to bridge, and depending on network
 * community pool or skETH faucet.
 */
@Component({
  selector: 'm-wallet__skale',
  templateUrl: 'skale.component.html',
  styleUrls: ['./skale.component.ng.scss'],
})
export class WalletSkaleComponent {
  constructor(private networkSwitch: NetworkSwitchService) {}

  /**
   * Current active network from service.
   * @returns { Network } - currently active network from service.
   */
  get activeNetwork(): Network {
    return this.networkSwitch.getActiveNetwork();
  }

  // currently active subtab.
  public activeSubTab$: BehaviorSubject<
    SkaleBridgeSubTab
  > = new BehaviorSubject<SkaleBridgeSubTab>('bridge');

  /**
   * Gets all subTabs for a given network.
   * @returns { SkaleBridgeSubTab[] } all sub-tabs for a given network.
   */
  get subTabs(): SkaleBridgeSubTab[] {
    const network = this.activeNetwork;
    return !network?.siteName || network.siteName === 'Mainnet'
      ? ['bridge', 'community-pool']
      : ['bridge', 'faucet'];
  }

  /**
   * Sets sub-tab value
   * @param { SkaleBridgeSubTab } subTab - sub-tap option a user has selected.
   */
  public setSubTab(subTab: SkaleBridgeSubTab): void {
    this.activeSubTab$.next(subTab);
  }
}
