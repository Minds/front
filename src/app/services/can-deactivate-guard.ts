import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CanDeactivateGuardService {
  canDeactivate(component: any) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
