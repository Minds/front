import { Injectable } from '@angular/core';
import { TransactionOverlayComponent } from './transaction-overlay.component';

@Injectable()
export class TransactionOverlayService {
  private comp: TransactionOverlayComponent;

  constructor() {
  }

  setComponent(comp: TransactionOverlayComponent) {
    this.comp = comp;
  }

  async showAndRun(fn: Function, title: string, amount: number = 0) {
    this.comp.show(title, amount);
    let result = null;
    try {
      let result = await fn();
    }
    catch (e) {
      throw e;
    } finally {
      this.comp.hide();
    }


    return result;
  }
}