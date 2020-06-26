import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DiscoveryService {
  isPlusPage$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  parentPath$: BehaviorSubject<string> = new BehaviorSubject('/discovery');

  constructor(private route: ActivatedRoute) {}

  setRoute(): void {
    const snapshotData = this.route.snapshot.root.firstChild.firstChild
      .firstChild.data;

    if (snapshotData['plus']) {
      this.isPlusPage$.next(true);
      this.parentPath$.next('/discovery/plus');
    } else {
      this.isPlusPage$.next(false);
      this.parentPath$.next('/discovery');
    }
  }
}
