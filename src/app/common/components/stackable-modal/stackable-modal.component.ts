import {
  Component,
  Injector,
  Input,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild,
} from '@angular/core';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';

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

  constructor(private _componentFactoryResolver: ComponentFactoryResolver) {}

  create(m: DynamicModalSettings): void {
    this.dismiss();

    if (!m.componentClass) {
      throw new Error('Unknown component class');
    }

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      m.componentClass
    );

    this.compRef = this.host.viewContainerRef.createComponent(
      componentFactory,
      void 0,
      m.injector
    );
    this.compInstance = this.compRef.instance;

    const opts = {
      ...{
        class: this.class,
      },
      ...m.opts,
    };

    this.class = opts.class;

    if (this.compInstance) {
      this.compInstance.opts = opts;
      if (m.data) {
        this.compInstance.data = m.data;
        this.compRef.changeDetectorRef.detectChanges();
      }
      this.hidden = false;
    }
  }

  dismiss(): void {
    this.hidden = true;

    if (this.compInstance) {
      this.compRef.destroy();
      this.host.viewContainerRef.clear();
    }
  }
}
