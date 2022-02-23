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
import { ConfigsService } from '../../../../common/services/configs.service';
import { FeaturesService } from '../../../../services/features.service';
import { NetworkBridgeSwapService } from './bridge/network-bridge-swap.service';

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
  >(false);

  public readonly selectedNetworkSiteName$: BehaviorSubject<
    NetworkSiteName
  > = new BehaviorSubject<NetworkSiteName>('Mainnet');

  // networks that can be swapped between.
  public swappableNetworks: Network[] = [];

  readonly cdnAssetsUrl: string;

  constructor(
    private networkSwitcher: NetworkSwitchService,
    private web3Wallet: Web3WalletService,
    private toast: FormToastService,
    configs: ConfigsService,
    private features: FeaturesService,
    private bridgeSwapService: NetworkBridgeSwapService
  ) {
    super();
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
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
   * Sets modal options.
   * @param { Function } onDismissIntent - set dismiss intent callback.
   * @param { Function } onSaveIntent - set save intent callback.
   * @param { BoostableEntity } entity - set entity that is the subject of the boost.
   */
  setModalData({ onDismissIntent, onSaveIntent, entity }) {
    this.onDismissIntent = onDismissIntent || (() => {});
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
    this.inProgress$.next(false);
  }

  navigateToBridge(network) {
    this.onDismissIntent();
    this.bridgeSwapService.open(network);
  }
}
