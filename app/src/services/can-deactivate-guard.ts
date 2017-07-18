import { Injectable } from "@angular/core";

@Injectable()
export class CanDeactivateGuardService {
  constructor() { }

  canDeactivate(component: any) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
  static _() {
    return new CanDeactivateGuardService();
  }
}
