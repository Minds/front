import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
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
  public readonly selectedNetworkSiteName$: BehaviorSubject<
    NetworkSiteName
  > = new BehaviorSubject<NetworkSiteName>('SKALE');

  public swappableNetworks: Network[] = [];

  // Completion intent.
  onComplete: () => any = () => {};

  // Dismiss intent.
  onDismissIntent: () => void = () => {};

  constructor(private networkSwitcher: NetworkSwitchService) {
    super();
  }

  ngOnInit(): void {
    this.swappableNetworks = this.networkSwitcher.getSwappableNetworks();
    this.setSelectedToActiveNetwork();
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

  get activeNetwork$(): Observable<Network> {
    return this.networkSwitcher.getActiveNetwork$();
  }

  public setTab(tab: NetworkSiteName): void {
    this.selectedNetworkSiteName$.next(tab);
  }

  private setSelectedToActiveNetwork(): void {
    this.subscriptions.push(
      this.activeNetwork$.pipe(take(1)).subscribe(network => {
        const swappableSiteNames = this.swappableNetworks.map(
          network => network.siteName
        );
        if (
          network?.siteName &&
          swappableSiteNames.includes(network.siteName)
        ) {
          this.selectedNetworkSiteName$.next(network.siteName);
          return;
        }
        this.selectedNetworkSiteName$.next('SKALE');
      })
    );
  }
}
