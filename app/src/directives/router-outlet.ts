import { Directive, DynamicComponentLoader, ComponentRef, ViewContainerRef, Attribute } from '@angular/core';
import { Router, RouterOutlet, ComponentInstruction } from '@angular/router-deprecated';

@Directive({
  selector: 'minds-router-outlet'
})
export class MindsRouterOutlet extends RouterOutlet{
  constructor(_viewContainerRef: ViewContainerRef, _loader: DynamicComponentLoader, _parentRouter: Router, @Attribute('name') nameAttr: string) {
    super(_viewContainerRef, _loader, _parentRouter, nameAttr);
  }

  routerCanReuse(nextInstruction: ComponentInstruction): Promise<boolean> {
    return <Promise<boolean>>Promise.resolve(false);
  }
}
