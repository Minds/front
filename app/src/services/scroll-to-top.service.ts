import { Injectable } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs/Rx";

@Injectable()
export class ScrollToTopService {

  constructor(private router: Router) { }

  private _routerListener: Subscription;

  listen(): this {
    this._routerListener = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0,0);
      }
    });
    return this;
  }

  unlisten(): this {
    this._routerListener.unsubscribe();
    return this;
  }

  static _(router: Router) {
    return new ScrollToTopService(router);
  }

}