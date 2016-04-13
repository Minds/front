import { PromiseWrapper } from 'angular2/src/facade/async';
import { Directive, DynamicComponentLoader, ComponentRef, ElementRef, Attribute } from 'angular2/core';
import * as routerMod from 'angular2/src/router/router';
import { RouterOutlet, ComponentInstruction } from 'angular2/router';

@Directive({selector: 'router-outlet'})
export class MindsRouterOutlet extends RouterOutlet{

  constructor(private elementRef: ElementRef, private loader: DynamicComponentLoader, private parentRouter : routerMod.Router, @Attribute('name') nameAttr: string) {
      super(elementRef, loader, parentRouter, nameAttr);
  }

  routerCanReuse(nextInstruction: ComponentInstruction): Promise<boolean> {
    return <Promise<boolean>>PromiseWrapper.resolve(false);
  }

}
