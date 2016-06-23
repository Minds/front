import { Directive, DynamicComponentLoader, ComponentRef, ViewContainerRef, Attribute } from '@angular/core';
import { Router, RouterOutlet, ComponentInstruction } from '@angular/router-deprecated';
import { PromiseWrapper } from '@angular/router-deprecated/src/facade/async';
import * as routerMod from '@angular/router-deprecated/src/router';

@Directive({
  selector: 'minds-router-outlet'
})
export class MindsRouterOutlet extends RouterOutlet{
  constructor(private viewContainerRef: ViewContainerRef, private loader: DynamicComponentLoader, private parentRouter : routerMod.Router, @Attribute('name') nameAttr: string) {
      super(viewContainerRef, loader, parentRouter, nameAttr);
  }

  routerCanReuse(nextInstruction: ComponentInstruction): Promise<boolean> {
    return <Promise<boolean>>PromiseWrapper.resolve(false);
  }
}
