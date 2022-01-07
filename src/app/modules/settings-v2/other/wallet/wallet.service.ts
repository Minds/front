import { Injectable } from '@angular/core';
import { Storage } from '../../../../services/storage';

// key for use in local storage
const STORAGE_KEY: string = 'hide_wallet_balance';

/**
 * Service for the handling of wallet privacy settings.
 */
@Injectable({ providedIn: 'root' })
export class SettingsV2WalletService {
  constructor(private storage: Storage) {}

  /**
   * Set a value to hide a users balance in storage.
   * @param { boolean } shouldHide - if true, storage should set wallet balance to hidden.
   */
  public setShouldHideWalletBalance(shouldHide: boolean): void {
    this.storage.set(STORAGE_KEY, shouldHide ? '1' : '0');
  }

  /**
   * Whether balance should be hidden.
   * @returns { boolean } true if wallet balance should be hidden.
   */
  public shouldHideWalletBalance(): boolean {
    return this.storage.get(STORAGE_KEY) === '1';
  }
}
