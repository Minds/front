import { Injectable, Injector } from '@angular/core';

import { OverlayModalComponent } from '../../common/components/overlay-modal/overlay-modal.component';
import isMobile from '../../helpers/is-mobile';

@Injectable()
export class OverlayModalService {
  private container: OverlayModalComponent;

  private _onDidDismissFn: Function;

  private stackable: boolean = false;

  static _() {
    return new OverlayModalService();
  }

  setContainer(container: OverlayModalComponent) {
    this.container = container;
    console.log('___SVC setcontainer()');
    return this;
  }

  setRoot(root: HTMLElement) {
    console.log('___SVC setRoot');
    this.container.setRoot(root);

    return this;
  }

  create(component, data?, opts?, injector?: Injector) {
    console.log('___SVC create()');
    if (!this.container) {
      throw new Error('Missing overlay container');
    }

    if (opts && opts.stackable) {
      this.stackable = true;
      console.log('this is stackable');
    }

    this._onDidDismissFn = void 0;

    this.container.create(component, opts, injector);
    this.container.setData(data);

    if (opts) {
      this.container.setOpts(opts);
    }

    return this;
  }

  setData(data?) {
    console.log('___SVC setData()');
    if (!this.container) {
      throw new Error('Missing overlay container');
    }

    this.container.setData(data);
    return this;
  }

  onDidDismiss(fn?: Function) {
    console.log('___SVC onDidDismiss()');
    if (!this.container) {
      throw new Error('Missing overlay container');
    }

    this._onDidDismissFn = fn;
    return this;
  }

  _didDismiss(data?: any) {
    console.log('___SVC _didDismiss()');
    if (this._onDidDismissFn) {
      this._onDidDismissFn(data);
    }
  }

  present() {
    console.log('___SVC present()');
    if (!this.container) {
      throw new Error('Missing overlay container');
    }

    this.container.present();
    return this;
  }

  dismiss(data?: any) {
    console.log('___SVC dismiss()');
    if (!this.container) {
      throw new Error('Missing overlay container');
    }

    this.container.dismiss(data);
    this._onDidDismissFn = void 0;

    return this;
  }

  canOpenInModal(): boolean {
    const isNotTablet = Math.min(screen.width, screen.height) < 768;
    const tooSmallForModal: boolean = screen.width < 768;

    if ((isMobile() && isNotTablet) || tooSmallForModal) {
      return false;
    }

    return true;
  }
}
