import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Web3WalletService } from '../../../../modules/blockchain/web3-wallet.service';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { FormToastService } from '../../../../common/services/form-toast.service';
import {
  Network,
  NetworkSiteName,
  NetworkSwitchService,
} from '../../../../common/services/network-switch-service';

@Component({
  selector: 'm-networkSwapBridge',
  templateUrl: 'network-swap-bridge-modal.component.html',
  styleUrls: ['network-swap-bridge-modal.ng.scss'],
})
export class NetworkSwapBridgeModalComponent extends AbstractSubscriberComponent
  implements OnInit {
  // whether load is in progress.
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  public readonly selectedNetworkSiteName$: BehaviorSubject<
    NetworkSiteName
  > = new BehaviorSubject<NetworkSiteName>('Mainnet');

  // networks that can be swapped between.
  public swappableNetworks: Network[] = [];

  constructor(
    private networkSwitcher: NetworkSwitchService,
    private web3Wallet: Web3WalletService,
    private toast: FormToastService
  ) {
    super();
  }

  /**
   * Modal options.
   * @param onComplete
   * @param onDismissIntent
   */
  set opts({ onComplete, onDismissIntent }) {
    this.onComplete = onComplete || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  /**
   * Currently active network from service.
   * @returns { Network } - currently active network.
   */
  get activeNetwork(): Network {
    return this.networkSwitcher.getActiveNetwork();
  }

  // Completion intent.
  onComplete: () => any = () => {};

  // Dismiss intent.
  onDismissIntent: () => void = () => {};

  async ngOnInit(): Promise<void> {
    this.swappableNetworks = this.networkSwitcher.getSwappableNetworks();
    await this.setSelectedToActiveNetwork();
  }

  /**
   * Set selected tab to param.
   * @param { NetworkSiteName } tab - new tab to switch to.
   * @returns { void }
   */
  public setTab(tab: NetworkSiteName): void {
    this.selectedNetworkSiteName$.next(tab);
  }

  /**
   * Sets currently selected network to active network.
   * @returns { Promise<void> }
   */
  private async setSelectedToActiveNetwork(): Promise<void> {
    if (!this.activeNetwork) {
      try {
        await this.networkSwitcher.switch(
          this.networkSwitcher.networks.mainnet.id
        );
      } catch (e) {
        this.toast.error(
          'An unknown error has occurred, please ensure you are connected to a supported network'
        );
        this.onDismissIntent();
      }
    }

    const swappableSiteNames = this.swappableNetworks.map(
      network => network.siteName
    );

    if (
      this.activeNetwork?.siteName &&
      swappableSiteNames.includes(this.activeNetwork.siteName)
    ) {
      this.selectedNetworkSiteName$.next(this.activeNetwork.siteName);
      this.inProgress$.next(false);
      return;
    }
    this.selectedNetworkSiteName$.next('SKALE');
    this.inProgress$.next(false);
  }
}
