import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynamic-host]',
  standalone: false,
})
export class DynamicHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
