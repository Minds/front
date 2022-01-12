import { Component } from '@angular/core';
import {
  HistoryRecord,
  RecordStatus,
  RecordType,
  WithdrawRecord,
} from '../polygon.types';
import { PolygonService } from '../polygon.service';
import { ethers } from 'ethers';

/**
 * Polygon Historic component, giving users the ability to swap between networks.
 */
@Component({
  selector: 'm-wallet__polygon-historic',
  templateUrl: 'historic.component.html',
  styleUrls: ['./historic.component.ng.scss'],
})
export class WalletPolygonHistoricComponent {
  constructor(public polygonService: PolygonService) {}

  /**
   * Iterates Enum to find key to determinated value
   * @returns { string }
   */
  getStatus(status: number) {
    return RecordStatus[status].replace(/_/, ' ');
  }

  /**
   * Iterates Enum to find key to determinated value
   * @returns { string }
   */
  getTitle(status: number) {
    return RecordType[status];
  }

  /**
   * Copies transaction hash to clipboard
   * @returns { void }
   */
  copyToClipboard(item: string) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', item);
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  formatAmount(amount: string) {
    return ethers.utils.formatEther(amount);
  }

  displaySpinner(record: HistoryRecord): boolean {
    return (
      record.status === RecordStatus.PENDING ||
      record.status === RecordStatus.ACTION_REQUIRED
    );
  }

  isSuccess(record: HistoryRecord): boolean {
    return record.status === RecordStatus.SUCCESS;
  }

  getExplorerUrl(record: HistoryRecord) {
    if (!record.txHash) {
      return '';
    }
    return `https://goerli.etherscan.io/tx/${record.txHash}`;
  }

  needsAction(transaction: HistoryRecord) {
    return transaction.status === RecordStatus.ACTION_REQUIRED;
  }

  exit(transaction: WithdrawRecord) {
    this.polygonService.exit(transaction.txBurn);
  }
}
