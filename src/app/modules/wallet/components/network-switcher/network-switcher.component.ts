import { Component, ElementRef, HostListener } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
import {
  NetworkSwitchService,
  NetworkMap,
  NetworkChainId,
  Network,
} from '../../../../common/services/network-switch-service';

/**
 * Network switcher component - allows a user to switch between L2s / Side-chains
 * Specified in the NetworkSwitchService.
 */
@Component({
  selector: 'm-walletNetworkSwitcher',
  templateUrl: './network-switcher.component.html',
  styleUrls: ['./network-switcher.component.ng.scss'],
})
export class WalletNetworkSwitcherComponent {
  // selection menu open.
  public expanded: boolean = false;

  // assets url.
  public readonly cdnAssetsUrl: string;

  /**
   * Gets currently active network's chain id.
   * @returns { BehaviorSubject<NetworkChainId> } - currently active network's chain id.
   */
  get activeChainId$(): BehaviorSubject<NetworkChainId> {
    return this.service.activeChainId$;
  }

  /**
   * Gets currently active networks's data from service.
   * @param { Observable<Network> } - currently active networks's data from service.
   */
  get activeNetwork$(): Observable<Network> {
    return this.service.getActiveNetwork$();
  }

  /**
   * Gets data of all active networks from service
   * @returns { NetworkMap } - data of all active networks from service.
   */
  get networks(): NetworkMap {
    return this.service.networks;
  }

  /**
   * Listens to clicks outside of component, closes menu if clicked outside.
   */
  @HostListener('document:click', ['$event'])
  externalClick($event) {
    if (!this.elementRef.nativeElement.contains($event.target)) {
      this.expanded = false;
    }
  }

  constructor(
    public service: NetworkSwitchService,
    private elementRef: ElementRef,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  /**
   * Fired on network change click.
   * @returns { Promise<void> }
   */
  public async onNetworkChange($event: NetworkChainId): Promise<void> {
    await this.service.switch($event);
    this.expanded = false;
  }

  /**
   * True if a network's data is all present to be shown.
   * @param { Network } network - network to check.
   * @returns { boolean } - true if network should be shown as an option.
   */
  public shouldShowNetwork(network: Network): boolean {
    return (
      !!network.id &&
      !!network.siteName &&
      !!network.logoPath &&
      !!network.description
    );
  }
}
