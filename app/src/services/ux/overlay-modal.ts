import { Injectable } from '@angular/core';

import { OverlayModalComponent } from '../../common/components/overlay-modal/overlay-modal.component';

@Injectable()
export class OverlayModalService {
  private container: OverlayModalComponent;

  private _onDidDismissFn: Function;

  static _() {
    return new OverlayModalService();
  }

  setContainer(container: OverlayModalComponent) {
    this.container = container;

    return this;
  }

  create(component, data?, opts?) {
    if (!this.container) {
      throw new Error('Missing overlay container');
    }

    this._onDidDismissFn = void 0;

    this.container.create(component, opts);
    this.container.setData(data);

    if (opts) {
      this.container.setOpts(opts);
    }

    return this;
  }

  setData(data?) {
    if (!this.container) {
      throw new Error('Missing overlay container');
    }

    this.container.setData(data);
    return this;
  }

  onDidDismiss(fn?: Function) {
    if (!this.container) {
      throw new Error('Missing overlay container');
    }

    this._onDidDismissFn = fn;
    return this;
  }

  _didDismiss() {
    if (this._onDidDismissFn) {
      this._onDidDismissFn();
    }
  }

  present() {
    if (!this.container) {
      throw new Error('Missing overlay container');
    }

    this.container.present();
    return this;
  }

  dismiss() {
    if (!this.container) {
      throw new Error('Missing overlay container');
    }

    this.container.dismiss();
    this._onDidDismissFn = void 0;

    return this;
  }

}
