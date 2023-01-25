import { ComponentType } from '@angular/cdk/overlay';
import {
  Compiler,
  Component,
  Injectable,
  Injector,
  OnDestroy,
} from '@angular/core';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import isMobile from '../../helpers/is-mobile';

export interface Modal<T> {
  setModalData(data: T & ModalDefaultData): void;
  getModalOptions?: () => {
    canDismiss?: () => Promise<boolean>;
  };
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

/**
 * Minimum width for a modal to open.
 */
const MINIMUM_MODAL_OPEN_WIDTH: number = 768;

@Injectable({
  providedIn: 'root',
})
export class ModalService implements OnDestroy {
  activeInstancesSubscription: Subscription;
  activeInstances: NgbModalRef[] = [];

  constructor(private service: NgbModal, private compiler: Compiler) {
    this.activeInstancesSubscription = service.activeInstances.subscribe(
      activeInstances => (this.activeInstances = activeInstances)
    );
  }

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
    const { data, injector, lazyModule, beforeDismiss, ...rest } = modalOptions;

    if (lazyModule) {
      const componentFactory = this.loadLazyModule(lazyModule, injector);
    }

    const ref = this.service.open(component, {
      injector,
      centered: true,
      keyboard: true,
      // scrollable: true,
      // modalDialogClass:,
      beforeDismiss: async () => {
        const { canDismiss } = ref.componentInstance.getModalOptions?.() || {};

        if (canDismiss) {
          return await canDismiss();
        }

        return true;
      },
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

    // ref.result is defined as "the promise that is resolved when
    // the modal is closed and rejected when the modal is dismissed."

    // The error below fires whenever dismiss() is used instead of close(),
    // and is not always really an 'error'
    return {
      dismiss: i => ref.dismiss(i),
      close: i => ref.close(i),
      dismissed: ref.dismissed,
      result: ref.result.catch(error => {
        console.log('ERROR', error);
      }),
    };
  }

  /**
   * Returns whether a modal with the given component instance is open
   * @param { ModalComponent } component
   * @returns { bool }
   */
  public isOpen<T>(component: ModalComponent<T>): boolean {
    const topMostModal = [...this.activeInstances].reverse()[0];

    return component === topMostModal?.componentInstance?.constructor;
  }

  /**
   * Whether modal can be opened given device / screen size.
   * @returns { boolean } true if modal can be opened given device / screen size.
   */
  public canOpenInModal(): boolean {
    const isNotTablet =
      Math.min(screen.width, screen.height) < MINIMUM_MODAL_OPEN_WIDTH;
    const tooSmallForModal: boolean =
      Math.min(screen.width, window.innerWidth) < MINIMUM_MODAL_OPEN_WIDTH;

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

  ngOnDestroy(): void {
    this.activeInstancesSubscription?.unsubscribe();
  }
}
