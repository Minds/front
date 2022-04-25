import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { AbstractSubscriberComponent } from '../../../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import {
  BridgeStep,
  HistoryRecord,
  RecordStatus,
  RecordType,
} from '../../constants/constants.types';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NetworkBridgeSwapService } from '../bridge-transfer/network-bridge-transfer.service';
import { NetworkSwitchService } from '../../../../../../../common/services/network-switch-service';
import { NetworkBridgeTxHistoryService } from './network-bridge-tx-history.service';

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
  implements OnInit, OnDestroy {
  public cdnAssetsUrl;

  // selected bridge entity
  public network;

  public userConfig;
  public isLoading = false;
  public pendingTotal = 0;
  public actionTotal = 0;

  public filterState$ = new BehaviorSubject<RecordStatus | null>(null);
  public items$ = new BehaviorSubject<HistoryRecord[]>([]);
  public filteredItems$ = combineLatest([this.filterState$, this.items$]).pipe(
    map(state => {
      const [filter, items] = state;

      const pending = items.filter(
        item => item.status === RecordStatus.PENDING
      );
      const actionRequired = items.filter(
        item => item.status === RecordStatus.ACTION_REQUIRED
      );

      this.pendingTotal = pending.length;
      this.actionTotal = actionRequired.length;

      switch (filter) {
        case RecordStatus.ACTION_REQUIRED:
          return actionRequired;
        case RecordStatus.PENDING:
          return pending;
      }
      return items;
    })
  );
  private querySubscription: Subscription;

  constructor(
    private readonly configs: ConfigsService,
    private readonly networkSwitcher: NetworkSwitchService,
    private readonly networkBridgeService: NetworkBridgeService,
    private readonly networkBridgeSwapService: NetworkBridgeSwapService,
    private readonly networkBridgeTxHistoryService: NetworkBridgeTxHistoryService
  ) {
    super();
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.userConfig = configs.get('user');
  }

  ngOnInit(): void {
    this.network = this.networkBridgeService.selectedBridge$.value;
    this.isLoading = true;
    this.querySubscription = this.networkBridgeTxHistoryService
      .getHistory(this.userConfig.eth_wallet)
      .subscribe(txs => {
        this.items$.next(txs);
        this.isLoading = false;
      });
  }

  // Dismiss intent.
  onDismissIntent = () => {};

  /**
   * Sets modal options.
   * @param { Function } onDismissIntent - set dismiss intent callback.
   * @param { Function } onSaveIntent - set save intent callback.
   */
  setModalData({ onDismissIntent }) {
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  setFilter(filter: 'action_required' | 'pending') {
    this.filterState$.next(
      filter === 'pending' ? RecordStatus.PENDING : RecordStatus.ACTION_REQUIRED
    );
  }

  handleActionRequired(item: HistoryRecord): void {
    if (
      item.type !== RecordType.WITHDRAW ||
      item.status !== RecordStatus.ACTION_REQUIRED
    ) {
      return;
    }
    this.onDismissIntent();
    this.networkBridgeService.currentStep$.next({
      step: BridgeStep.ACTION_REQUIRED,
      data: item,
    });
    this.networkBridgeSwapService.open(
      this.networkSwitcher.networks.polygon,
      false
    );
  }

  formatState() {
    switch (this.filterState$.value) {
      case RecordStatus.SUCCESS:
        return 'success';
      case RecordStatus.PENDING:
        return 'pending';
      case RecordStatus.ERROR:
        return 'error';
      case RecordStatus.UNKNOWN:
        return 'unknown';
      case RecordStatus.ACTION_REQUIRED:
        return 'action required';
    }
  }
}
