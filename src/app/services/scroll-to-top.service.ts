import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';

/** Parent routes that are disabled - a route matches if it starts with one of these routes. */
const DISABLED_PARENT_ROUTES: string[] = ['/network/admin/analytics/'];

@Injectable()
export class ScrollToTopService {
  private _routerListener: Subscription;

  static _(router: Router, route: ActivatedRoute) {
    return new ScrollToTopService(router, route);
  }

  constructor(private router: Router, private route: ActivatedRoute) {}

  listen(): this {
    this._routerListener = this.router.events
      .pipe(
        filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((events: RoutesRecognized[]) => {
        const disabledPaths: Array<string> = ['wallet'],
          previousPath = events[0].urlAfterRedirects.split('/')[1],
          currentPath = events[1].urlAfterRedirects.split('/')[1];

        const currentPathDisabled =
          disabledPaths.indexOf(currentPath) > -1 ||
          DISABLED_PARENT_ROUTES.some((parentRoute: string): boolean =>
            events?.[1]?.urlAfterRedirects.startsWith(parentRoute)
          );
        const pathChanged = previousPath !== currentPath;

        // Disable scroll on disabledPaths only when navigating within them
        if (!currentPathDisabled || (currentPathDisabled && pathChanged)) {
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
