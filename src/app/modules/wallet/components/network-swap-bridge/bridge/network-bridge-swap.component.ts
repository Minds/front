import { Component, OnInit } from '@angular/core';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { NetworkBridgeService } from './services/network-bridge.service';

@Component({
  selector: 'm-networkBridgeSwap',
  templateUrl: 'network-bridge-swap.component.html',
  styleUrls: [
    '../network-swap-bridge-common.ng.scss',
    './network-bridge-swap.ng.scss',
  ],
})
export class NetworkBridgeSwapModalComponent extends AbstractSubscriberComponent
  implements OnInit {
  public cdnAssetsUrl;

  constructor(
    private readonly networkBridgeService: NetworkBridgeService,
    configs: ConfigsService
  ) {
    super();
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  // selected bridge entity
  public entity;

  ngOnInit(): void {
    this.networkBridgeService.selectedBridge$.next(this.entity);
  }

  // Completion intent.
  onComplete: () => any = () => {};

  // Dismiss intent.
  onDismissIntent: () => void = () => {};

  /**
   * Sets modal options.
   * @param { Function } onDismissIntent - set dismiss intent callback.
   * @param { Function } onSaveIntent - set save intent callback.
   * @param { BoostableEntity } entity - set entity that is the subject of the boost.
   */
  setModalData({ onDismissIntent, onSaveIntent, entity }) {
    this.onDismissIntent = onDismissIntent || (() => {});
    this.entity = entity;
  }
}
