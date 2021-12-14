import { Compiler, Component, Injectable, Injector } from '@angular/core';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import isMobile from '../../helpers/is-mobile';
import { ComponentType } from '@angular/cdk/overlay';

export interface Modal<T> {
  setModalData(data: T & ModalDefaultData): void;
}

export interface ModalRef<T> extends Partial<NgbModalRef> {
  close: (value?: T) => void;
  result: Promise<T>;
}

interface ModalDefaultData {
  onDismiss: () => void;
  onDismissIntent: () => void;
}

export interface ModalOptions<T> extends NgbModalOptions {
  data?: Omit<T, 'onDismiss' | 'onDismissIntent'>;
  injector?: Injector;
  lazyModule?: any; // TODO: add types
}

type ModalComponent<T> = ComponentType<Modal<T>>;

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private service: NgbModal, private compiler: Compiler) {}

  /**
   * Presents the modal and returns an Observable
   * @param { Component } component the component instance the modal should load
   * @param { ModalOptions<T> } modalOptions
   * @return { ModalRef } reference to the modal instance
   */
  public present<T>(
    component: ModalComponent<T>,
    modalOptions: ModalOptions<T> = {}
  ): ModalRef<any> {
    const { data, injector, lazyModule, ...rest } = modalOptions;
    if (lazyModule) {
      const componentFactory = this.loadLazyModule(lazyModule, injector);
    }

    const ref = this.service.open(component, {
      injector,
      centered: true,
      keyboard: true,
      // scrollable: true,
      // modalDialogClass:,
      // windowClass: 'm-modalV3__wrapper',
      size: modalOptions.size || 'md',
      // ariaDescribedBy:
      // ariaLabelledBy:
      // backdrop: // TODO: use static for when a modal is forced
      // scrollable:
      ...rest,
    });

    const options = {
      onDismiss: () => ref.dismiss(),
      /**
       * supporting legacy
       * @deprecated use onDismiss
       **/
      onDismissIntent: () => ref.dismiss(),
      ...data,
    };
    ref.componentInstance.setModalData?.(options);

    return {
      dismiss: i => ref.dismiss(i),
      close: i => ref.close(i),
      dismissed: ref.dismissed,
      result: ref.result.catch(error => {
        console.log('ERROR', error);
      }),
    };
  }

  public canOpenInModal(): boolean {
    const isNotTablet = Math.min(screen.width, screen.height) < 768;
    const tooSmallForModal: boolean = screen.width < 768;

    return !((isMobile() && isNotTablet) || tooSmallForModal);
  }

  /**
   * Dismisses all open modals
   * its inset component
   */
  public dismissAll(): void {
    this.service.dismissAll();
  }

  private async loadLazyModule(module: any, injector: Injector) {
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
}
