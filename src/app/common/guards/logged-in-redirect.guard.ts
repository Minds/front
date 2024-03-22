import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { Session } from '../../services/session';
import { Location, isPlatformBrowser } from '@angular/common';
import { ToasterService } from '../services/toaster.service';

/**
 * Guard to be applied to routes such that a user will be asked to log in
 * if they are not already, and try to access the route. An informative
 * toast will be shown, the login referrer will be set for post-login redirect
 * and the will sent the user to the login page via the router.
 */
@Injectable({ providedIn: 'root' })
export class LoggedInRedirectGuard implements CanActivate {
  constructor(
    private router: Router,
    private session: Session,
    private loginReferrer: LoginReferrerService,
    private location: Location,
    private toast: ToasterService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  /**
   * True if user is logged in, else handled logged out case.
   * @returns { boolean } true if route can be activated.
   */
  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.session.isLoggedIn()) {
        this.toast.warn('Please log in before viewing this page.');
        this.loginReferrer.register(this.location.path());
        this.router.navigate(['/login']);
        return false;
      }
    }
    return true;
  }
}

/**
 * Guard function that can be used as an alternative to the class based
 * redirect guard above. Allows the passing of a route to send the user to.
 * @param { string } loggedOutRoute - route to send user to if not logged in.
 * @returns { CanActivateFn } - guard function.
 */
export function loggedInRedirectGuard(loggedOutRoute: string): CanActivateFn {
  return (): boolean => {
    const router: Router = inject(Router);
    const session: Session = inject(Session);
    const toast: ToasterService = inject(ToasterService);
    const loginReferrer: LoginReferrerService = inject(LoginReferrerService);
    const location: Location = inject(Location);

    if (!session.isLoggedIn()) {
      toast.warn('Please log in before viewing this page.');
      loginReferrer.register(location.path());
      router.navigateByUrl(loggedOutRoute);
      return false;
    }

    return true;
  };
}
