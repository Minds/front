import { Component, ElementRef, HostListener } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
import {
  NetworkSwitchService,
  ChainMap,
  ChainId,
  Chain,
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
   * Gets currently active chain id from local state.
   * @returns { BehaviorSubject<ChainId> } - currently active chain id from local state
   */
  get activeChainId$(): BehaviorSubject<ChainId> {
    return this.service.activeChainId$;
  }

  /**
   * Gets currently active chain's data from service.
   * @param { Observable<Chain> } - currently active chain's data from service.
   */
  get activeChain$(): Observable<Chain> {
    return this.service.getActiveChain$();
  }

  /**
   * Gets data of all active chains from service
   * @returns { ChainMap } - data of all active chains from service.
   */
  get chains(): ChainMap {
    return this.service.chains;
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
  public async onNetworkChange($event: ChainId): Promise<void> {
    await this.service.switch($event);
    this.expanded = false;
  }

  /**
   * True if chain's data is all present to be shown.
   * @param { Chain } chain - chain to check.
   * @returns { boolean } - true if chain should be shown as an option.
   */
  public shouldShowChain(chain: Chain): boolean {
    return (
      !!chain.id && !!chain.siteName && !!chain.logoPath && !!chain.description
    );
  }
}
