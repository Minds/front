import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { PermissionsService } from '../../../../common/services/permissions.service';

/**
 * Guard that redirects a user away from the tenant admin console report queue if they don't have permission to moderate
 */
@Injectable({
  providedIn: 'root',
})
export class CanModerateContentGuard {
  constructor(
    private permissions: PermissionsService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.permissions.canModerateContent()) {
      return true;
    } else {
      this.router.navigate(['/network/admin/moderation/community-guidelines']); // Redirect to community guidelines
      return false;
    }
  }
}
