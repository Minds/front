import {
  Component,
  ViewChild,
  Input,
  ComponentFactoryResolver,
  AfterViewInit,
  Type,
  ChangeDetectorRef,
  ComponentRef,
  ElementRef,
} from '@angular/core';

import { DynamicHostDirective } from '../../directives/dynamic-host.directive';

import { BoostButton } from '../../../modules/legacy/components/buttons/boost';

/**
 * DEPRECATED
 * A reusable button
 *
 * TODO: Replace all instances with 'm-button'
 */
@Component({
  selector: 'minds-button',
  template: `
    <ng-template dynamic-host></ng-template>
  `,
})
export class MindsButton implements AfterViewInit {
  @ViewChild(DynamicHostDirective, { static: true })
  cardHost: DynamicHostDirective;

  object: any = {};
  @Input() type: string;

  componentRef: ComponentRef<{}>;
  componentInstance: any;
  anchorRef: ElementRef;

  cssClasses: string = '';

  private initialized: boolean = false;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver) {}

  @Input('object') set _object(value: any) {
    const oldType = this.type;

    this.object = value ? value : {};

    if (this.initialized) {
      if (!this.componentInstance || this.type !== oldType) {
        setTimeout(() => this.loadComponent(), 0);
      } else {
        this.updateData();
      }
    }
  }

  @Input('hostClass') set _hostClass(value: string) {
    this.cssClasses = value || '';

    if (this.initialized) {
      this.updateClasses();
    }
  }

  ngAfterViewInit() {
    this.loadComponent();
    this.initialized = true;
  }

  resolveComponentClass(type: string): Type<{}> | null {
    if (!type) {
      return null;
    }

    if (type === 'boost') {
      return BoostButton;
    }

    return null;
  }

  loadComponent() {
    const componentClass = this.resolveComponentClass(this.type);

    if (!componentClass) {
      return;
    }

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
        componentClass
      ),
      viewContainerRef = this.cardHost.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
    this.anchorRef = viewContainerRef.element;

    this.updateData();
    this.updateClasses();
  }

  updateData() {
    if (!this.componentInstance) {
      return;
    }

    this.componentInstance.object = this.object;

    this.componentRef.changeDetectorRef.detectChanges();
  }

  updateClasses() {
    if (
      !this.anchorRef ||
      !this.anchorRef.nativeElement ||
      !this.anchorRef.nativeElement.nextSibling
    ) {
      return;
    }

    // @note: find a better way (when Angular implements one)
    this.anchorRef.nativeElement.nextSibling.className = this.cssClasses;
  }
}
