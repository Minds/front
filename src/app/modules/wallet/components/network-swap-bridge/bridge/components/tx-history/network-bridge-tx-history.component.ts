import { Component, OnInit } from '@angular/core';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { AbstractSubscriberComponent } from '../../../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import { RecordStatus } from '../../constants/constants.types';

@Component({
  selector: 'm-networkBridgeTxHistory',
  templateUrl: 'network-bridge-tx-history.component.html',
  styleUrls: [
    '../bridge-panel/network-swap-bridge-common.ng.scss',
    './network-bridge-tx-history.ng.scss',
    '../bridge-transfer/network-bridge-transfer.ng.scss',
  ],
})
export class NetworkBridgeTxHistoryModalComponent
  extends AbstractSubscriberComponent
  implements OnInit {
  public cdnAssetsUrl;

  // selected bridge entity
  public entity;

  // selected tab option
  public pending = false;

  items = [
    {
      status: RecordStatus.PENDING,
    },
    {
      status: RecordStatus.SUCCESS,
    },
    {
      status: RecordStatus.SUCCESS,
    },
    {
      status: RecordStatus.SUCCESS,
    },
  ];

  constructor(
    private readonly networkBridgeService: NetworkBridgeService,
    configs: ConfigsService
  ) {
    super();
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }
  ngOnInit(): void {
    this.entity = this.networkBridgeService.selectedBridge$.value;
  }

  // Dismiss intent.
  onDismissIntent: () => void = () => {};

  /**
   * Sets modal options.
   * @param { Function } onDismissIntent - set dismiss intent callback.
   * @param { Function } onSaveIntent - set save intent callback.
   * @param { BoostableEntity } entity - set entity that is the subject of the boost.
   */
  setModalData({ onDismissIntent }) {
    this.onDismissIntent = onDismissIntent || (() => {});
  }
}
