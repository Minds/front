import { Injectable } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DiscoveryService {
  isPlusPage$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  parentPath$: BehaviorSubject<string> = new BehaviorSubject('/discovery');

  setRouteData(data: Data): void {
    if (data['plus']) {
      this.isPlusPage$.next(true);
      this.parentPath$.next('/discovery/plus');
    } else {
      this.isPlusPage$.next(false);
      this.parentPath$.next('/discovery');
    }
  }
}
