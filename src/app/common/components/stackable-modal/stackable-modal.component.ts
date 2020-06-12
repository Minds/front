import {
  Component,
  Injector,
  Input,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild,
} from '@angular/core';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { OverlayModalComponent } from '../overlay-modal/overlay-modal.component';

export interface DynamicModalSettings {
  componentClass: any;
  data?: any;
  opts?: any;
  injector?: Injector;
}

/**
 * Only use for modals that need to be stacked on top of the standard
 * overlay modal component. (Don't use this as a standalone modal)
 */

@Component({
  selector: 'm-stackableModal',
  templateUrl: './stackable-modal.component.html',
  providers: [OverlayModalService],
})
export class StackableModalComponent {
  private _settings: DynamicModalSettings;
  @Input() set settings(value: DynamicModalSettings) {
    this._settings = value;
    if (value && this.hidden === true) {
      this.create(value);
    }
  }
  get settings(): DynamicModalSettings {
    return this._settings;
  }

  @ViewChild(DynamicHostDirective, { static: true })
  private host: DynamicHostDirective;

  private compRef: ComponentRef<{}>;
  private compInstance;

  class: string = '';
  hidden: boolean = true;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private service: OverlayModalService
  ) {}

  //TODOJM - this is the old version of create()
  // create(m: DynamicModalSettings): void {
  //   this.dismiss();

  //   if (!m.componentClass) {
  //     throw new Error('Unknown component class');
  //   }

  //   /**
  //    * Create a component dynamically
  //    */
  //   const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
  //     m.componentClass
  //   );

  //   this.compRef = this.host.viewContainerRef.createComponent(
  //     componentFactory,
  //     void 0,
  //     m.injector
  //   );
  //   this.compInstance = this.compRef.instance;

  //   const opts = {
  //     ...{
  //       class: this.class,
  //       stackable: true,
  //     },
  //     ...m.opts,
  //   };

  //   this.class = opts.class;

  //   if (this.compInstance) {
  //     this.compInstance.opts = opts;
  //     if (m.data) {
  //       this.compInstance.data = m.data;
  //       this.compRef.changeDetectorRef.detectChanges();
  //     }
  //   }
  //   this.present();
  // }

  create(m: DynamicModalSettings): void {
    this.dismiss();

    if (!m.componentClass) {
      throw new Error('Unknown component class');
    }

    /**
     * Create a factory for the dynamic overlay modal
     */
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      OverlayModalComponent
    );

    /**
     * Use the factory to create a new overlay modal component
     */
    this.compRef = this.host.viewContainerRef.createComponent(
      componentFactory,
      void 0,
      m.injector
    );
    this.compInstance = this.compRef.instance;

    const opts = {
      ...{
        class: this.class,
        stackable: true,
      },
      ...m.opts,
    };

    this.class = opts.class;

    // if (this.compInstance) {
    //   this.compInstance.opts = opts;
    //   if (m.data) {
    //     this.compInstance.data = m.data;
    //     this.compRef.changeDetectorRef.detectChanges();
    //   }
    // }

    /**
     * Control the stackable modal with the scoped instance of the overlay modal service
     */
    this.service.setContainer(this.compInstance);
    /**
     * Populate the inset component
     */
    this.service
      // TODOOJM only do data and opts if they exist
      .create(m.componentClass, m.data, m.opts)
      .onDidDismiss(() => {
        console.log('dismissedddd');
        // TODOOJM make this an event emitter?
      })
      .present();
    this.hidden = false;
  }

  dismiss(): void {
    this.hidden = true;

    if (this.compInstance) {
      this.compRef.destroy();
      this.host.viewContainerRef.clear();
    }
  }
}
