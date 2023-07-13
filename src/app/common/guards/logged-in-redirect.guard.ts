import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { Session } from '../../services/session';
import { Location } from '@angular/common';
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
    private toast: ToasterService
  ) {}

  /**
   * True if user is logged in, else handled logged out case.
   * @returns { boolean } true if route can be activated.
   */
  canActivate(): boolean {
    if (!this.session.isLoggedIn()) {
      this.toast.warn('Please log in before viewing this page.');
      this.loginReferrer.register(this.location.path());
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
