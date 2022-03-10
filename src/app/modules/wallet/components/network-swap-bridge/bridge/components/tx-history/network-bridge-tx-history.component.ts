import { Component, OnInit } from '@angular/core';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { AbstractSubscriberComponent } from '../../../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import { RecordStatus } from '../../constants/constants.types';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

type RecordStatusText = 'none' | 'action_required' | 'pending';

function mapStatusText(text: RecordStatusText): RecordStatus {
  if (text === 'action_required') {
    return RecordStatus.ACTION_REQUIRED;
  }
  return RecordStatus.PENDING;
}

// For Testing purposes
const txs = [
  {
    status: RecordStatus.ACTION_REQUIRED,
  },
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
  public filterState$ = new BehaviorSubject<RecordStatusText>('none');

  public items$ = new BehaviorSubject(txs);

  public filteredItems$ = combineLatest([this.filterState$, this.items$]).pipe(
    map(state => {
      const [filter, items] = state;
      if (filter === 'none') {
        return items;
      }
      const status = mapStatusText(filter);
      return items.filter(item => item.status === status);
    })
  );

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
   */
  setModalData({ onDismissIntent }) {
    this.onDismissIntent = onDismissIntent || (() => {});
  }
}
