import { Compiler, Component, Injectable, Injector, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import isMobile from '../../helpers/is-mobile';
import { ComponentType } from '@angular/cdk/overlay';

export type ModalRef = {
  dismiss: (reason?: string) => void;
  close: (value?: any) => void;
  dismissed: Observable<any>;
  result: Promise<any>;
};

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  module: Type<unknown>;

  constructor(private service: NgbModal, private compiler: Compiler) {}

  /**
   * Set the module to be loaded - can be imported like so.
   * const { MyModule } = await import(
   *   './my-module-lazy.module'
   * );
   * @param { Type<unknown> } mod - the module to be loaded.
   * @returns { ModalService } - chainable.
   */
  setLazyModule(mod: Type<unknown>): ModalService {
    this.module = mod;
    return this;
  }

  async loadLazyModule(module: any, injector: Injector) {
    const moduleFactory = await this.compiler.compileModuleAsync(module);
    const moduleRef = moduleFactory.create(injector);

    if (typeof (moduleRef.instance as any).resolveComponent != 'function') {
      console.error(
        'Your lazy loaded module MUST have a resolveComponent function'
      );
      return;
    }

    return (moduleRef as any).instance.resolveComponent();
  }

  /**
   * Presents the modal and returns an Observable
   * @param { Component } component the component instance the modal should load
   * @param { Object } opts the options to pass to the component
   * @param { Injector } injector
   * @return { ModalRef } reference to the modal instance
   */
  present(component: ComponentType<any>, opts: any = {}, injector?: Injector): ModalRef {
    if (this.module) {
      const componentFactory = this.loadLazyModule(this.module, injector);
    }

    const ref = this.service.open(component, {
      injector,
      centered: true, // FIXME: maybe this shouldn't be true all the time
      // modalDialogClass:,
      windowClass: 'm-modalV3__wrapper',

      // size:
      // ariaDescribedBy:
      // ariaLabelledBy:
      // backdrop: // TODO: use static for when a modal is forced
      // scrollable:
    });

    const options = {
      onDismiss: ref.dismiss,
      /**
       * supporting legacy
       * @deprecated use onDismiss
       **/
      onDismissIntent: ref.dismiss,
      ...opts,
    };
    ref.componentInstance.opts = options;
    ref.componentInstance.data = options;

    return {
      dismiss: i => ref.dismiss(i),
      close: i => ref.close(i),
      dismissed: ref.dismissed,
      result: ref.result.catch(error => {
        console.log('ERROR', error);
      }),
    };
  }

  canOpenInModal(): boolean {
    const isNotTablet = Math.min(screen.width, screen.height) < 768;
    const tooSmallForModal: boolean = screen.width < 768;

    return !((isMobile() && isNotTablet) || tooSmallForModal);
  }

  /**
   * Dismisses all open modals
   * its inset component
   */
  dismissAll(): void {
    this.service.dismissAll();
  }
}
