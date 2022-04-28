import { Injectable } from '@angular/core';
import { ModalService } from '../../../../../../../services/ux/modal.service';
import { NetworkBridgeTxHistoryModalComponent } from './network-bridge-tx-history.component';
import { Apollo, ApolloBase, gql } from 'apollo-angular';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DepositRecord,
  RecordStatus,
  RecordType,
  WithdrawRecord,
} from '../../constants/constants.types';

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

@Injectable({ providedIn: 'root' })
export class NetworkBridgeTxHistoryService {
  private posBridgePolygon: ApolloBase;
  private posBridgeMainnet: ApolloBase;

  constructor(
    private modalService: ModalService,
    private readonly apolloProvider: Apollo
  ) {
    this.posBridgePolygon = this.apolloProvider.use('posBridgePolygon');
    this.posBridgeMainnet = this.apolloProvider.use('posBridgeMainnet');
  }

  open() {
    const modal = this.modalService.present(
      NetworkBridgeTxHistoryModalComponent,
      {
        data: {
          onDismissIntent: () => modal.close(),
        },
        modalDialogClass: 'modal-content--history',
      }
    );
  }

  getHistory(id: string) {
    const mainnetQuerySubscription = this.posBridgeMainnet.watchQuery<
      TransactionsQueryResultWithBlock
    >({
      query: GET_TRANSACTIONS_BY_AUTHOR_AND_BLOCK,
      pollInterval: 5000,
      variables: { id: id.toLowerCase() },
    });

    const polygonQuerySubscription = this.posBridgePolygon.watchQuery<
      TransactionsQueryResult
    >({
      query: GET_TRANSACTIONS_BY_AUTHOR,
      pollInterval: 5000,
      variables: { id: id.toLowerCase() },
    });

    return combineLatest([
      mainnetQuerySubscription.valueChanges,
      polygonQuerySubscription.valueChanges,
    ]).pipe(
      map(data => {
        const [{ data: mainnet }, { data: polygon }] = data;

        const deposits = this.getDepositTransactions(mainnet, polygon);
        const withdraws = this.getWithdrawTransactions(mainnet, polygon);

        return [...deposits, ...withdraws].sort(
          (dateA, dateB) => dateB.timestamp - dateA.timestamp
        );
      })
    );
  }

  /**
   * Get deposit transactions. Looks in both networks
   * to determine the state of the transactions
   */
  private getDepositTransactions(
    mainnet: TransactionsQueryResult,
    polygon: TransactionsQueryResult
  ): DepositRecord[] {
    const deposits = [...polygon.wallet.deposits];
    return mainnet.wallet.deposits.map(
      (deposit): DepositRecord => {
        // Look for deposit transaction in Polygon
        const polygonTxIndex = deposits.findIndex(
          _deposit => _deposit.amount === deposit.amount
        );
        const polygonTx = deposits[polygonTxIndex];

        // If transaction is found in polygon, the deposit is completed
        const status = polygonTx ? RecordStatus.SUCCESS : RecordStatus.PENDING;

        // Remove transaction from list
        if (polygonTx) {
          deposits.splice(polygonTxIndex, 1);
        }

        return {
          status,
          type: RecordType.DEPOSIT,
          txHash: deposit.txHash,
          amount: deposit.amount,
          txPolygon: polygonTx?.txHash,
          txBlock: parseInt(deposit.txBlock, 10),
          timestamp: parseInt(deposit.timestamp, 10),
        };
      }
    );
  }

  /**
   * Get withdraw transactions. Looks in both networks
   * to determine the state of the transactions
   */
  private getWithdrawTransactions(
    mainnet: TransactionsQueryResultWithBlock,
    polygon: TransactionsQueryResult
  ): WithdrawRecord[] {
    // Get the last synced polygon block in mainnet
    const lastSyncedBlock = parseInt(mainnet.headerBlocks[0]?.end || '0', 10);

    const withdraws = [...mainnet.wallet.withdraws];
    return polygon.wallet.withdraws.map(
      (withdraw): WithdrawRecord => {
        // Look for the withdraw transaction in Mainnet
        const txIndex = withdraws.findIndex(
          _withdraw => _withdraw.amount === withdraw.amount
        );
        const mainnetTx = withdraws[txIndex];
        if (mainnetTx) {
          withdraws.splice(txIndex, 1);
        }

        // If transaction is found in mainnet, the withdraw is completed
        let status = mainnetTx ? RecordStatus.SUCCESS : RecordStatus.PENDING;
        const txBlock = parseInt(withdraw.txBlock, 10);

        if (status === RecordStatus.PENDING && txBlock <= lastSyncedBlock) {
          // If the transaction is not completed and mainnet is synced
          // the withdraw transaction can be executed in mainnet
          status = RecordStatus.ACTION_REQUIRED;
        }

        return {
          status,
          type: RecordType.WITHDRAW,
          txBurn: withdraw.txHash,
          amount: withdraw.amount,
          txHash: mainnetTx?.txHash,
          timestamp: parseInt(mainnetTx?.timestamp || withdraw.timestamp, 10),
          txBlock: mainnetTx && parseInt(mainnetTx.txBlock, 10),
        };
      }
    );
  }
}
