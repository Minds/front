import { Injectable } from '@angular/core';
import { TransactionOverlayService } from './transaction-overlay/transaction-overlay.service';
import randomString from '../../helpers/random-string';
import asyncSleep from '../../helpers/async-sleep';
import * as ethSigner from 'ethjs-signer';
import * as ethAccount from 'ethjs-account';

const SECURE_MODE_TIMEOUT = 60 * 1000; // 1 minute

@Injectable()
export class LocalWalletService {
  sign: any;
  secureMode: boolean = false;

  protected account: string;
  protected privateKey: string;

  protected _pruneTimer: any;

  constructor(protected transactionOverlay: TransactionOverlayService) {
    this.sign = ethSigner.sign;
  }

  signTransaction(rawTx: any, cb: Function) {
    if (!this.privateKey) {
      throw new Error('No Account Private Key');
    }

    return cb(null, this.sign(rawTx, this.privateKey));
  }

  accounts(cb: Function) {
    const accounts = [];

    if (this.account) {
      accounts.push(this.account);
    }

    return cb(null, accounts);
  }

  async unlock() {
    if (this.account && this.privateKey) {
      return Promise.resolve(true);
    }

    try {
      const { privateKey, secureMode } = await this.transactionOverlay.waitForAccountUnlock(),
        account = ethAccount.privateToAccount(privateKey).address;

      this.privateKey = privateKey;
      this.account = account;
      this.secureMode = !!secureMode;

      this.prune();
    } catch (e) {
      this.privateKey = void 0;
      this.account = void 0;
      this.secureMode = false;
    }

    return this.account && this.privateKey;
  }

  prune() {
    if (this._pruneTimer) {
      clearTimeout(this._pruneTimer);
    }

    if (!this.secureMode) {
      return;
    }

    this._pruneTimer = setTimeout(() => {
      this.account = void 0;
      this.privateKey = void 0;
    }, SECURE_MODE_TIMEOUT);
  }

  async create(fast = true) {
    let entropy = '';

    if (fast) {
      entropy = randomString(64);
    } else {
      while (entropy.length < 64) {
        entropy += randomString(8);
        await asyncSleep(Math.floor(Math.random() * (600 - 350 + 1)) + 350);
      }
    }

    return await ethAccount.generate(entropy);
  }

  public static _(transactionOverlay: TransactionOverlayService) {
    return new LocalWalletService(transactionOverlay);
  }
}
