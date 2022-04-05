import { Component, Input, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { Record, RecordStatus } from '../../../constants/constants.types';
import * as moment from 'moment';
import { PolygonService } from '../../../../../../../../modules/wallet/components/tokens/polygon/polygon.service';

@Component({
  selector: 'm-networkBridgeTxHistoryItem',
  templateUrl: 'network-bridge-tx-history-item.component.html',
  styleUrls: ['./network-bridge-tx-history-item.ng.scss'],
})
export class NetworkBridgeTxHistoryItemComponent implements OnInit {
  @Input() item: Record;

  constructor(public readonly polygonService: PolygonService) {}
  ngOnInit(): void {}

  isPendingAction(item: Record): boolean {
    return item.status === RecordStatus.PENDING;
  }

  isActionRequired(item): boolean {
    return item.status === RecordStatus.ACTION_REQUIRED;
  }

  isSuccess(item): boolean {
    return item.status === RecordStatus.SUCCESS;
  }

  formatAmount(amount: string) {
    return parseFloat(ethers.utils.formatEther(amount)).toFixed(2);
  }

  formatDate(timestamp: number) {
    return moment(timestamp * 1000).format('Do MMM YYYY');
  }

  isDeposit(item) {
    return item.__typename === 'Deposit';
  }

  getExplorerUrl(record) {
    if (!record.txHash) {
      return '';
    }
    return `https://goerli.etherscan.io/tx/${record.txHash}`;
  }

  exit(transaction) {
    this.polygonService.exit(transaction.txBurn);
  }
}
