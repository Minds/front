import { Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';
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

  constructor(private router: Router) {}

  listen(): this {
    this._routerListener = this.router.events
      .pipe(filter(e => e instanceof Scroll))
      .subscribe((e: Scroll) => {
        if (e.position) {
          this.offsetForRoute.set(e.routerEvent.url, e.position[1]);
        }
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

  async restoreScroll(url: string) {
    const scrollOffsetTop = this.getOffsetForRoute(url);

    if (scrollOffsetTop) {
      window.scrollTo({
        top: scrollOffsetTop,
      });
    }
  }
}
