import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, Scroll, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScrollRestorationService {
  private _routerListener: Subscription;
  /**
   * a map of routes and their scroll offset.
   * TODO: are they being properly cleared?
   */
  private offsetForRoute: Map<string, number> = new Map();

  constructor(
    private router: Router // private viewportScroller: ViewportScroller
  ) {}

  listen(): this {
    this._routerListener = this.router.events
      .pipe(filter(e => e instanceof Scroll))
      .subscribe((e: Scroll) => {
        if (e.position) {
          this.offsetForRoute.set(e.routerEvent.url, e.position[1]);
          // backward navigation
          // this.viewportScroller.scrollToPosition(e.position);
        }
        // } else if (e.anchor) {
        //   // anchor navigation
        //   this.viewportScroller.scrollToAnchor(e.anchor);
        // } else {
        //   // forward navigation
        //   this.viewportScroller.scrollToPosition([0, 0]);
        // }
      });
    return this;
  }

  getOffsetForRoute(url: string) {
    return this.offsetForRoute.get(url);
  }

  unlisten(): this {
    if (this._routerListener) this._routerListener.unsubscribe();
    return this;
  }
}
