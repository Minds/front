import { Component, OnInit } from '@angular/core';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { AbstractSubscriberComponent } from '../../../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import {
  DepositRecord,
  Record,
  RecordStatus,
  RecordType,
  WithdrawRecord,
} from '../../constants/constants.types';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo, ApolloBase, gql } from 'apollo-angular';

const GET_TRANSACTIONS_BY_AUTHOR = gql`
  query GetTransactionsByAuthor($id: ID!) {
    wallet(id: $id) {
      deposits {
        id
        status
        amount
        timestamp
        txHash
        txBlock
      }
      withdraws {
        id
        status
        amount
        timestamp
        txHash
        txBlock
      }
    }
  }
`;

const GET_TRANSACTIONS_BY_AUTHOR_AND_BLOCK = gql`
  query GetTransactionsByAuthorAndBlock($id: ID!) {
    wallet(id: $id) {
      deposits {
        id
        status
        amount
        timestamp
        txHash
        txBlock
      }
      withdraws {
        id
        status
        amount
        timestamp
        txHash
        txBlock
      }
    }
    headerBlocks(first: 1, orderBy: end, orderDirection: desc) {
      end
    }
  }
`;

interface TransactionsQueryResult {
  wallet: {
    deposits: {
      id: string;
      status: string;
      amount: string;
      timestamp: string;
      txHash: string;
      txBlock: string;
    }[];
    withdraws: {
      id: string;
      status: string;
      amount: string;
      timestamp: string;
      txHash: string;
      txBlock: string;
    }[];
  };
}

interface TransactionsQueryResultWithBlock extends TransactionsQueryResult {
  headerBlocks: { end: string }[];
}

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
  public isLoading = false;
  public pendingTotal = 0;
  public actionTotal = 0;
  // selected tab option
  public filterState$ = new BehaviorSubject<RecordStatus | null>(null);
  public items$ = new BehaviorSubject<Record[]>([]);
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
  private posBridgePolygon: ApolloBase;
  private posBridgeMainnet: ApolloBase;
  private querySubscription: Subscription;

  constructor(
    private readonly networkBridgeService: NetworkBridgeService,
    private configs: ConfigsService,
    private apolloProvider: Apollo
  ) {
    super();
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.userConfig = configs.get('user');
    this.posBridgePolygon = this.apolloProvider.use('posBridgePolygon');
    this.posBridgeMainnet = this.apolloProvider.use('posBridgeMainnet');
  }

  ngOnInit(): void {
    this.entity = this.networkBridgeService.selectedBridge$.value;
    this.isLoading = true;

    const variables = { id: this.userConfig.eth_wallet.toLowerCase() };

    const mainnetQuerySubscription = this.posBridgeMainnet.watchQuery<
      TransactionsQueryResultWithBlock
    >({
      query: GET_TRANSACTIONS_BY_AUTHOR_AND_BLOCK,
      variables,
      pollInterval: 5000,
    });
    const polygonQuerySubscription = this.posBridgePolygon.watchQuery<
      TransactionsQueryResult
    >({
      query: GET_TRANSACTIONS_BY_AUTHOR,
      variables,
      pollInterval: 5000,
    });

    this.querySubscription = combineLatest([
      mainnetQuerySubscription.valueChanges,
      polygonQuerySubscription.valueChanges,
    ]).subscribe(data => {
      const [{ data: mainnet }, { data: polygon }] = data;

      const lastSyncedBlock = mainnet.headerBlocks[0]
        ? parseInt(mainnet.headerBlocks[0].end)
        : 0;

      const polygonDeposits = [...polygon.wallet.deposits];
      const deposits = mainnet.wallet.deposits.map(
        (deposit): DepositRecord => {
          const polygonTxIndex = polygonDeposits.findIndex(polygonDeposit => {
            return polygonDeposit.amount === deposit.amount;
          });
          const polygonTx = polygonDeposits[polygonTxIndex];
          if (polygonTx) {
            polygonDeposits.splice(polygonTxIndex, 1);
          }

          const status: RecordStatus = polygonTx
            ? RecordStatus.SUCCESS
            : RecordStatus.PENDING;

          return {
            type: RecordType.DEPOSIT,
            status,
            txHash: deposit.txHash,
            amount: deposit.amount,
            txBlock: parseInt(deposit.txBlock),
            timestamp: parseInt(deposit.timestamp),
            txPolygon: polygonTx?.txHash,
          };
        }
      );

      const mainnetWithdraws = [...mainnet.wallet.withdraws];
      const withdraws = polygon.wallet.withdraws.map(
        (withdraw): WithdrawRecord => {
          const mainnetTxIndex = mainnetWithdraws.findIndex(mainnetWithdraw => {
            return mainnetWithdraw.amount === withdraw.amount;
          });
          const mainnetTx = mainnetWithdraws[mainnetTxIndex];
          if (mainnetTx) {
            mainnetWithdraws.splice(mainnetTxIndex, 1);
          }

          let status: RecordStatus = mainnetTx
            ? RecordStatus.SUCCESS
            : RecordStatus.PENDING;

          if (
            status === RecordStatus.PENDING &&
            parseInt(withdraw.txBlock) <= lastSyncedBlock
          ) {
            status = RecordStatus.ACTION_REQUIRED;
          }

          return {
            type: RecordType.WITHDRAW,
            status,
            txBurn: withdraw.txHash,
            amount: withdraw.amount,
            timestamp: mainnetTx
              ? parseInt(mainnetTx.timestamp)
              : parseInt(withdraw.timestamp),
            txHash: mainnetTx?.txHash,
            txBlock: mainnetTx && parseInt(mainnetTx.txBlock),
          };
        }
      );

      console.log({ deposits, withdraws });

      const allTx = [...deposits, ...withdraws];
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

  setFilter(filter: 'action_required' | 'pending') {
    this.filterState$.next(
      filter === 'pending' ? RecordStatus.PENDING : RecordStatus.ACTION_REQUIRED
    );
  }

  formatState() {
    return this.filterState$.value.replace('_', ' ');
  }
}
