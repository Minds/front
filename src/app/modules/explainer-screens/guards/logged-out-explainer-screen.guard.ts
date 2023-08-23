import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Session } from '../../../services/session';
import { ExplainerScreensService } from '../services/explainer-screen.service';

/**
 * Guard to prevent access to logged in routes when logged out, BUT still
 * show explainer screens if one is available for the route a user is
 * trying to navigate to.
 * @returns { CanActivateFn } - guard function.
 */
export function loggedOutExplainerScreenGuard(): CanActivateFn {
  return (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean => {
    if (inject(Session).isLoggedIn()) {
      return true;
    }

    // if not logged in, handle a route change so that any relevant explainer modal will show.
    const explainerScreenService: ExplainerScreensService = inject(
      ExplainerScreensService
    );
    explainerScreenService.handleRouteChange(state.url);
    return false;
  };
}
