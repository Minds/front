import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import {
  HistoryRecord,
  Record,
  RecordStatus,
  RecordType,
  WithdrawRecord,
} from '../../../constants/constants.types';
import * as moment from 'moment';

@Component({
  selector: 'm-networkBridgeTxHistoryItem',
  templateUrl: 'network-bridge-tx-history-item.component.html',
  styleUrls: ['./network-bridge-tx-history-item.ng.scss'],
})
export class NetworkBridgeTxHistoryItemComponent implements OnInit {
  @Input() item: HistoryRecord;
  @Input() click = new EventEmitter();

  constructor() {}

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

  isWithdraw(item: Record): item is WithdrawRecord {
    return item.type === RecordType.WITHDRAW;
  }

  getExplorerUrl(record: HistoryRecord) {
    if (!record.txHash) {
      return '';
    }
    return `https://goerli.etherscan.io/tx/${record.txHash}`;
  }

  formatStatus(status: RecordStatus): string {
    if (status === RecordStatus.ACTION_REQUIRED) {
      return 'Action Required';
    }
    if (status === RecordStatus.PENDING) {
      return 'Pending';
    }
    if (status === RecordStatus.SUCCESS) {
      return 'Success';
    }
    if (status === RecordStatus.ERROR) {
      return 'Error';
    }
    return 'Unknown';
  }

  handleClick() {
    this.click.emit();
  }
}
