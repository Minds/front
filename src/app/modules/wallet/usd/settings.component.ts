import { Component, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';

import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';
import { RevenueOptionsComponent } from '../../monetization/revenue/options.component';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-wallet--usd--settings',
  template: `
    <ng-template dynamic-host></ng-template>
  `
})
export class WalletUSDSettingsComponent {
  @ViewChild(DynamicHostDirective) host: DynamicHostDirective;

  componentRef;
  componentInstance: RevenueOptionsComponent;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver, private router: Router, private session: Session) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.loadComponent();
  }

  loadComponent() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(RevenueOptionsComponent),
      viewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
  }
}
