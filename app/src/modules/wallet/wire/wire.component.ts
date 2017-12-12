import { Component, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';

import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';
import { WireConsoleComponent } from '../../wire/console/console.component';
import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-wallet--wire',
  template: `
    <ng-template dynamic-host></ng-template>
  `
})
export class WalletWireComponent {
  @ViewChild(DynamicHostDirective) host: DynamicHostDirective;

  componentRef;
  componentInstance: WireConsoleComponent;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver, private router: Router, private session: Session) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.loadComponent();
  }

  loadComponent() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(WireConsoleComponent),
      viewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
  }
}
