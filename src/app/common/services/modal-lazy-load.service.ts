import { ComponentType } from '@angular/cdk/portal';
import {
  Compiler,
  ComponentFactory,
  Injectable,
  Injector,
  Type,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  StackableModalEvent,
  StackableModalService,
  StackableModalState,
} from '../../services/ux/stackable-modal.service';

export interface LazyModule {
  resolveComponent(): ComponentFactory<unknown>;
}

export interface LazyLoadingService {
  open(): Promise<any>;
}

export interface LazyComponent {
  opts: Object;
  onSaveIntent(): void;
  onDismissIntent(): void;
}

@Injectable({ providedIn: 'root' })
export class ModalLazyLoadService {
  module: Type<unknown>;
  component: ComponentType<unknown>;
  opts: Object;

  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private stackableModal: StackableModalService
  ) {}

  /**
   * Set the module to be loaded - can be imported like so.
   * const { MyModule } = await import(
   *   './my-module-lazy.module'
   * );
   * @param { Type<unknown> } mod - the module to be loaded.
   * @returns { ModalLazyLoadService } - chainable.
   */
  setLazyModule(mod: Type<unknown>): ModalLazyLoadService {
    this.module = mod;
    return this;
  }

  /**
   * Set the modal component to be displayed.
   * @param { ComponentType<unknown> } - the component to be displayed.
   * @returns { ModalLazyLoadService } - chainable.
   */
  setComponent(component: ComponentType<unknown>): ModalLazyLoadService {
    this.component = component;
    return this;
  }

  /**
   * Opts to be passed to stackable modal.
   * @param { Object } opts - opts to pass to stackable modal.
   * @returns { ModalLazyLoadService } - chainable.
   */
  setOpts(opts: Object): ModalLazyLoadService {
    this.opts = opts;
    return this;
  }

  /**
   * Lazy load modules and open modal.
   * @returns { Promise<any> }
   */
  public async open(): Promise<any> {
    const moduleFactory = await this.compiler.compileModuleAsync(this.module);
    const moduleRef = moduleFactory.create(this.injector);

    if (typeof (moduleRef.instance as any).resolveComponent != 'function') {
      console.error(
        'Your lazy loaded module MUST have a resolveComponent function'
      );
      return;
    }

    const componentFactory = (moduleRef as any).instance.resolveComponent();

    const onSuccess$: Subject<any> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(this.component, null, this.opts)
      .toPromise();

    // Modal was closed.
    if (evt.state === StackableModalState.Dismissed && !onSuccess$.isStopped) {
      throw 'DismissedModalException';
    }

    return onSuccess$.toPromise();
  }

  /**
   * Dismiss the modal.
   * @returns { void }
   */
  public dismiss(): void {
    try {
      this.stackableModal.dismiss();
    } catch (e) {
      // do nothing
    }
  }
}
