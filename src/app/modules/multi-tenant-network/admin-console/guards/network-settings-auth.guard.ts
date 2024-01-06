import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ToasterService } from '../../../../common/services/toaster.service';

/**
 * Auth guard for network settings pages. Ensures we ARE on a tenant network
 * and the user IS an admin.
 */
@Injectable({ providedIn: 'root' })
export class NetworkSettingsAuthGuard implements CanActivate {
  constructor(
    protected configs: ConfigsService,
    private session: Session,
    private router: Router,
    private toaster: ToasterService
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
    return true; // ojm remove
    if (this.session.isAdmin() && this.configs.get<boolean>('is_tenant')) {
      return true;
    }
    this.toaster.warn('You do not have permission to access this route.');
    this.router.navigate(['/']);
    return false;
  }
}
