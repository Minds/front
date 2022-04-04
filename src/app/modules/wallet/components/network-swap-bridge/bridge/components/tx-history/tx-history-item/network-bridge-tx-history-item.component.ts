import { Component, Input, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { RecordStatus } from '../../../constants/constants.types';
import * as moment from 'moment';
import { PolygonService } from '../../../../../../../../modules/wallet/components/tokens/polygon/polygon.service';

function mapTextToStatus(statusText) {
  const auxEnum = Object.keys(RecordStatus).slice(5, 10);
  const index = auxEnum.indexOf(statusText);
  return index;
}
@Component({
  selector: 'm-networkBridgeTxHistoryItem',
  templateUrl: 'network-bridge-tx-history-item.component.html',
  styleUrls: ['./network-bridge-tx-history-item.ng.scss'],
})
export class NetworkBridgeTxHistoryItemComponent implements OnInit {
  @Input() item;

  constructor(public readonly polygonService: PolygonService) {}
  ngOnInit(): void {}

  isPendingAction(item): boolean {
    return mapTextToStatus(item.status) === RecordStatus.PENDING;
  }

  isActionRequired(item): boolean {
    return mapTextToStatus(item.status) === RecordStatus.ACTION_REQUIRED;
  }

  isSuccess(item): boolean {
    return mapTextToStatus(item.status) === RecordStatus.SUCCESS;
  }

  formatAmount(amount: number) {
    return parseFloat(ethers.utils.formatEther(amount));
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
