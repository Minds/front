import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { BlockchainConsoleComponent } from '../../../blockchain/console/console.component';
import { DynamicHostDirective } from '../../../../common/directives/dynamic-host.directive';

@Component({
  selector: 'm-wallet-token--settings',
  template: `
    <ng-template dynamic-host></ng-template>
  `
})

export class WalletTokenSettingsComponent implements AfterViewInit {

  @ViewChild(DynamicHostDirective) host: DynamicHostDirective;

  componentRef;
  componentInstance: BlockchainConsoleComponent;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver,) {
  }

  ngAfterViewInit() {
    this.loadComponent();
  }

  loadComponent() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(BlockchainConsoleComponent),
      viewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
  }
}