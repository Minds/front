import { Injectable } from '@angular/core';

@Injectable()
export class CanDeactivateGuardService {

  static _() {
    return new CanDeactivateGuardService();
  }

  canDeactivate(component: any) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }

}
