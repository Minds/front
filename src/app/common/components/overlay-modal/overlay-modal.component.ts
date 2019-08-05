import {
  Component,
  AfterViewInit,
  ViewChild,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  Injector, ElementRef
} from '@angular/core';

import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { OverlayModalService } from '../../../services/ux/overlay-modal';

@Component({
  moduleId: module.id,
  selector: 'm-overlay-modal',
  template: `
    <div class="m-overlay-modal--backdrop" [hidden]="hidden" (click)="dismiss()"></div>
    <div class="m-overlay-modal {{class}}" [hidden]="hidden" #modalElement>
      <a class="m-overlay-modal--close" (click)="dismiss()"><i class="material-icons">close</i></a>
      <ng-template dynamic-host></ng-template>
    </div>
  `
})
export class OverlayModalComponent implements AfterViewInit {

  hidden: boolean = true;
  class: string = '';

  @ViewChild(DynamicHostDirective, { static: true })
  private host: DynamicHostDirective;

  private componentRef: ComponentRef<{}>;
  private componentInstance;

  @ViewChild('modalElement', { static: true }) protected modalElement: ElementRef;

  constructor(
    private service: OverlayModalService,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngAfterViewInit() {
    this.service.setContainer(this);
  }

  create(componentClass, opts?, injector?: Injector) {
    this.dismiss();

    opts = { ...{
      class: '',
    }, ...opts };

    this.class = opts.class;

    if (!componentClass) {
      throw new Error('Unknown component class');
    }

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(componentClass),
      viewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory, void 0, injector);
    this.componentInstance = this.componentRef.instance;
    this.componentInstance.parent = this.modalElement.nativeElement;
  }

  setData(data) {
    if (!this.componentInstance) {
      return;
    }

    this.componentInstance.data = data;
    this.componentRef.changeDetectorRef.detectChanges();
  }

  setOpts(opts) {
    if (!this.componentInstance) {
      return;
    }

    this.componentInstance.opts = opts;
  }

  present() {
    if (!this.componentInstance) {
      return;
    }

    this.hidden = false;

    if (document && document.body) {
      document.body.classList.add('m-overlay-modal--shown');
    }
  }

  dismiss() {
    this.hidden = true;

    if (document && document.body) {
      document.body.classList.remove('m-overlay-modal--shown');
    }

    if (!this.componentInstance) {
      return;
    }

    this.componentRef.destroy();
    this.host.viewContainerRef.clear();

    this.service._didDismiss();
  }
}
