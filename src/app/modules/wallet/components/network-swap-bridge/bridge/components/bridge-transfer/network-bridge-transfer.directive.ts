import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[divBinder]' })
export class NetworkBridgeBinderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
