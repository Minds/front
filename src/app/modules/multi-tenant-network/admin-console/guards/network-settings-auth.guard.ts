import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { PermissionsService } from '../../../../common/services/permissions.service';

/**
 * Auth guard for network settings pages. Ensures we ARE on a tenant network
 * and the user IS an admin. (Or if we can moderate, if going to a moderation route)
 */
@Injectable({ providedIn: 'root' })
export class NetworkSettingsAuthGuard {
  constructor(
    protected configs: ConfigsService,
    private session: Session,
    private router: Router,
    private toaster: ToasterService,
    private permissions: PermissionsService
  ) {}

  /**
   * Whether route can be activated based upon whether user is an admin and is
   * on a tenant network. If not, redirect to home page.
   * @param { ActivatedRouteSnapshot } route - route.
   * @param { RouterStateSnapshot } state - router state.
   * @returns { boolean } true if route can be activated.
   */
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isModerationRoute = state.url.includes('/moderation/reports');

    // Make sure we're on a tenant site
    if (this.configs.get<boolean>('is_tenant')) {
      // Allow access if user is an admin
      if (this.session.isAdmin()) {
        return true;
      }

      // Allow access to moderation reports if the user can moderate
      if (this.permissions.canModerateContent()) {
        if (isModerationRoute) {
          return true;
        } else {
          this.router.navigate(['/network/admin/moderation/reports']);
          return false;
        }
      }

      if (!this.session.isLoggedIn()) {
        this.router.navigate(['/login'], {
          queryParams: { redirectUrl: state.url },
        });
        return false;
      }
    }

    this.toaster.warn('You do not have permission to access this route.');
    this.router.navigate(['/']);
    return false;
  }
}
