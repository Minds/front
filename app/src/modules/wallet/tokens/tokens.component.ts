import { Component, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';
import { Subscription } from 'rxjs/Rx';
import { BlockchainConsoleComponent } from '../../blockchain/console/console.component';

@Component({
  selector: 'm-wallet--tokens',
  template: `<ng-template dynamic-host></ng-template>`
})

export class WalletTokensComponent {

  @ViewChild(DynamicHostDirective) host: DynamicHostDirective;
  
  componentRef;
  componentInstance: BlockchainConsoleComponent;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  ngOnInit() { }

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
