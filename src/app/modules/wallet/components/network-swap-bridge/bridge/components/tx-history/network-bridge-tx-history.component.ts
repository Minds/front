import { Component, OnInit } from '@angular/core';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { AbstractSubscriberComponent } from '../../../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import { RecordStatus } from '../../constants/constants.types';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo, ApolloBase, gql } from 'apollo-angular';

type RecordStatusText = 'none' | 'action_required' | 'pending';

function mapStatusText(text: RecordStatusText): RecordStatus {
  if (text === 'action_required') {
    return RecordStatus.ACTION_REQUIRED;
  }
  return RecordStatus.PENDING;
}

const GET_TRANSACTIONS_BY_AUTHOR = gql`
  query GetTransactionsByAuthor($id: ID!) {
    wallets(where: { id: $id }) {
      deposits {
        id
        status
        amount
        timestamp
        txHash
      }
      withdraws {
        id
        status
        amount
        timestamp
        txHash
        txBurn
      }
    }
  }
`;

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

  public userConfig;

  private apollo: ApolloBase;

  public isLoading = false;

  public pendingTotal = 0;

  public actionTotal = 0;

  // selected tab option
  public filterState$ = new BehaviorSubject<RecordStatusText>('none');

  public items$ = new BehaviorSubject([]);

  public filteredItems$ = combineLatest([this.filterState$, this.items$]).pipe(
    map(state => {
      const [filter, items] = state;

      this.pendingTotal = items.filter(
        item => item.status.toLowerCase() === 'pending'
      ).length;
      this.actionTotal = items.filter(
        item => item.status.toLowerCase() === 'action_required'
      ).length;

      if (filter === 'none') {
        return items;
      }
      // const status = mapStatusText(filter);
      return items.filter(item => item.status.toLowerCase() === filter);
    })
  );

  constructor(
    private readonly networkBridgeService: NetworkBridgeService,
    configs: ConfigsService,
    private apolloProvider: Apollo
  ) {
    super();
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.userConfig = configs.get('user');
    this.apollo = this.apolloProvider.use('allTransactions');
  }

  private querySubscription: Subscription;

  ngOnInit(): void {
    this.entity = this.networkBridgeService.selectedBridge$.value;
    this.isLoading = true;
    this.querySubscription = this.apollo
      .watchQuery({
        query: GET_TRANSACTIONS_BY_AUTHOR,
        variables: {
          id: this.userConfig.eth_wallet.toLowerCase(),
        },
        pollInterval: 5000,
      })
      .valueChanges.subscribe(({ data }: any) => {
        const allTx = data.wallets[0].deposits.concat(
          data.wallets[0].withdraws
        );
        allTx.sort((dateA, dateB) => dateB.timestamp - dateA.timestamp);
        this.items$.next(allTx);
        this.isLoading = false;
      });
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

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
