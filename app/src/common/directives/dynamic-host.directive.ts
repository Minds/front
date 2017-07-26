import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynamic-host]'
})
export class DynamicHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
