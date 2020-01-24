import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  Event,
  NavigationEnd,
  NavigationStart,
} from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable()
export class ScrollToTopService {
  private _routerListener: Subscription;

  static _(router: Router, route: ActivatedRoute) {
    return new ScrollToTopService(router, route);
  }

  constructor(private router: Router, private route: ActivatedRoute) {}

  listen(): this {
    this._routerListener = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log('urlstart', event.url);
        console.log('navEventStart', event);
      }
      if (event instanceof NavigationEnd) {
        console.log('urlend', event.url);
        console.log('navEventEnd', event);

        // if (this.url !== '/wallet')
        // console.log('this.route.url', this.route.url);
        window.scrollTo(0, 0);
      }
    });
    return this;
  }

  unlisten(): this {
    this._routerListener.unsubscribe();
    return this;
  }
}
