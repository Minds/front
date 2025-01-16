import { Injectable } from '@angular/core';
import { TransactionOverlayComponent } from './transaction-overlay.component';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionOverlayService {
  private comp: TransactionOverlayComponent;

  setComponent(comp: TransactionOverlayComponent) {
    this.comp = comp;
  }

  waitForSetupMetaMask(): Promise<string> {
    const compEventEmitter = this.comp.show(this.comp.COMP_SETUP_METAMASK);

    return new Promise((resolve, reject) => {
      const subscription: Subscription = compEventEmitter.subscribe((data) => {
        subscription.unsubscribe();
        if (data && !(data instanceof Error)) {
          resolve(data);
        } else {
          reject((data && data.message) || 'User cancelled');
        }
      });
    });
  }

  waitForAccountUnlock(): Promise<{ privateKey; account; secureMode }> {
    let compEventEmitter = this.comp.show(this.comp.COMP_UNLOCK);

    return new Promise((resolve, reject) => {
      let subscription: Subscription = compEventEmitter.subscribe((data) => {
        subscription.unsubscribe();

        if (data && !(data instanceof Error)) {
          resolve(data);
        } else {
          reject((data && data.message) || 'User cancelled');
        }
      });
    });
  }

  waitForLocalTxObject(
    defaultTxObject: Object = {},
    message: string = '',
    tokenDelta: number = 0
  ): Promise<any> {
    let compEventEmitter = this.comp.show(
      this.comp.COMP_LOCAL,
      message,
      defaultTxObject,
      { tokenDelta }
    );

    return new Promise((resolve, reject) => {
      let subscription: Subscription = compEventEmitter.subscribe((data) => {
        subscription.unsubscribe();

        if (data && !(data instanceof Error)) {
          resolve(data);
        } else {
          reject(data || new Error('User cancelled'));
        }
      });
    });
  }

  async waitForExternalTx(fn: Function, message: string = ''): Promise<string> {
    this.comp.show(this.comp.COMP_METAMASK, message);

    let result = null;

    try {
      result = await fn();
      await result.wait();
    } catch (e) {
      if (
        e.value &&
        e.value.message &&
        e.value.message.includes('User denied transaction signature')
      ) {
        throw new Error('User denied the transaction');
      } else {
        console.error(e);
        throw new Error('Unexpected error. Is your wallet unlocked?');
      }
    } finally {
      this.comp.hide();
    }

    return result.hash;
  }
}
