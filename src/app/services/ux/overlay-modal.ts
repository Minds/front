import { Injectable, Injector } from '@angular/core';
import { OverlayModalInterface } from '../../common/components/overlay-modal/overlay-modal.interface';
import isMobile from '../../helpers/is-mobile';

@Injectable()
export class OverlayModalService {
  private container: OverlayModalInterface;

  private _onDidDismissFn: Function;

  protected stackable: boolean = false;

  static _() {
    return new OverlayModalService();
  }

  setContainer(container: OverlayModalInterface) {
    this.container = container;
    return this;
  }

  setRoot(root: HTMLElement) {
    this.container.setRoot(root);

    return this;
  }

  create(component, data?, opts?, injector?: Injector) {
    if (!this.container) {
      throw new Error('Missing overlay container');
    }

    if (opts && opts.stackable) {
      this.stackable = true;
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

  _didDismiss(data?: any) {
    if (this._onDidDismissFn) {
      this._onDidDismissFn(data);
    }
  }

  present() {
    if (!this.container) {
      throw new Error('Missing overlay container');
    }

    this.container.present();
    return this;
  }

  dismiss(data?: any) {
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
