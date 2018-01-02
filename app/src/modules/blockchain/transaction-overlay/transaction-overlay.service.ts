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

  async showAndRun(fn: Function, title: string, notes: string = '') {
    this.comp.show(title, notes);
    let result = null;
    try {
      result = await fn();
    }
    catch (e) {
      throw e;
    } finally {
      this.comp.hide();
    }


    return result;
  }
}