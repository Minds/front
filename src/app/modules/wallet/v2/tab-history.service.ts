/**
 * Stores tab history in local storage.
 * @author Ben Hayward
 */
import { Injectable } from '@angular/core';
import { Storage } from '../../../services/storage';

@Injectable()
export class WalletTabHistoryService {
  constructor(private storage: Storage) {}

  /**
   * Gets last tab from local storage.
   * @returns { string } - tab a user last accessed.
   */
  get lastTab(): string {
    const tab = this.storage.get('previous_wallet_tab');
    return tab;
  }

  /**
   * Sets last tab in local storage.
   * @param { string } - tab url relative to router e.g. /tokens/overview.
   * @returns { void }
   */
  set lastTab(tab: string) {
    this.storage.set('previous_wallet_tab', tab);
  }
}
