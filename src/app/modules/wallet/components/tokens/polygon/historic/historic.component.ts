import { Component } from '@angular/core';
import { MockData } from '../constants';
import { Record, RecordStatus, RecordType } from '../polygon.types';
/**
 * Polygon Historic component, giving users the ability to swap between networks.
 */
@Component({
  selector: 'm-wallet__polygon-historic',
  templateUrl: 'historic.component.html',
  styleUrls: ['./historic.component.ng.scss'],
})
export class WalletPolygonHistoricComponent {
  // handles tabs state
  pending = false;

  // list of transactions
  transactions: Record[] = MockData;

  /**
   * Changes active tab.
   * @returns { void }
   */
  async changeTab() {
    this.pending = !this.pending;
    this.filter();
  }

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
   * Truncates transaction hash
   * @returns { string }
   */
  truncatedHash(transactionHash: string): string {
    return transactionHash.substr(0, 4) + '...' + transactionHash.substr(-4);
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

  /**
   * Filters transaction list according to the tab state.
   * @returns { void }
   */
  filter() {
    if (this.pending) {
      this.transactions = this.transactions.filter(val => val.status === 0);
    } else {
      this.transactions = MockData;
    }
  }
}
