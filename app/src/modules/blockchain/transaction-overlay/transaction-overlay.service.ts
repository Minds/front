import { Injectable } from '@angular/core';
import { TransactionOverlayComponent } from './transaction-overlay.component';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class TransactionOverlayService {
  private comp: TransactionOverlayComponent;

  setComponent(comp: TransactionOverlayComponent) {
    this.comp = comp;
  }

  waitForAccountUnlock(): Promise<{ privateKey, account, secureMode }> {
    let compEventEmitter = this.comp.show(this.comp.COMP_UNLOCK);

    return new Promise((resolve, reject) => {
      let subscription: Subscription = compEventEmitter.subscribe(data => {
        subscription.unsubscribe();

        if (data) {
          resolve(data);
        } else {
          reject('User cancelled');
        }
      });
    });
  }

  waitForLocalTxObject(defaultTxObject: Object = {}, message: string = ''): Promise<any> {
    let compEventEmitter = this.comp.show(this.comp.COMP_LOCAL, message, defaultTxObject);

    return new Promise((resolve, reject) => {
      let subscription: Subscription = compEventEmitter.subscribe(data => {
        subscription.unsubscribe();

        if (data) {
          resolve(data);
        } else {
          reject('User cancelled');
        }
      });
    });
  }

  async waitForExternalTx(fn: Function, message: string = ''): Promise<string> {
    this.comp.show(this.comp.COMP_METAMASK, message);

    let result = null;

    try {
      result = await fn();
    } catch (e) {
      throw e;
    } finally {
      this.comp.hide();
    }

    return result;
  }
}
