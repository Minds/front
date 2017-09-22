import { Component, ViewChild, ComponentFactoryResolver } from '@angular/core';

import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';
import { BoostConsoleComponent } from '../../boost/console/console.component';

@Component({
  moduleId: module.id,
  selector: 'm-wallet-boost',
  template: `
    <ng-template dynamic-host></ng-template>
  `
})
export class WalletBoostComponent {
  @ViewChild(DynamicHostDirective) host: DynamicHostDirective;

  componentRef;
  componentInstance: BoostConsoleComponent;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngAfterViewInit() {
    this.loadComponent();
  }

  loadComponent() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(BoostConsoleComponent),
      viewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
  }
}
