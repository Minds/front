import { Injectable } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable()
export class ScrollToTopService {
  private _routerListener: Subscription;

  static _(router: Router) {
    return new ScrollToTopService(router);
  }

  constructor(private router: Router) {}

  listen(): this {
    this._routerListener = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    return this;
  }

  unlisten(): this {
    if (this._routerListener) this._routerListener.unsubscribe();
    return this;
  }
}
