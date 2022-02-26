import { Component, OnInit } from '@angular/core';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { AbstractSubscriberComponent } from '../../../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import { NetworkBridgeTxHistoryService } from '../tx-history/network-bridge-tx-history.service';

@Component({
  selector: 'm-networkBridgeTransfer',
  templateUrl: 'network-bridge-transfer.component.html',
  styleUrls: [
    '../bridge-panel/network-swap-bridge-common.ng.scss',
    './network-bridge-transfer.ng.scss',
  ],
})
export class NetworkBridgeTransferModalComponent
  extends AbstractSubscriberComponent
  implements OnInit {
  public cdnAssetsUrl;

  constructor(
    private readonly networkBridgeService: NetworkBridgeService,
    configs: ConfigsService,
    private readonly networkBridgeTxHistoryService: NetworkBridgeTxHistoryService
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

  onSaveIntent: () => void = () => {};

  /**
   * Sets modal options.
   * @param { Function } onDismissIntent - set dismiss intent callback.
   * @param { Function } onSaveIntent - set save intent callback.
   * @param { BoostableEntity } entity - set entity that is the subject of the boost.
   */
  setModalData({ onDismissIntent, onSaveIntent, entity }) {
    this.onDismissIntent = onDismissIntent || (() => {});
    this.onSaveIntent = onSaveIntent || (() => {});
    this.entity = entity;
  }

  navigateToTxHistory() {
    this.onSaveIntent();
    this.networkBridgeTxHistoryService.open();
  }
}
