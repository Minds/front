import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { IsTenantService } from '../services/is-tenant.service';

/**
 * Prevents tenant site users from accessing
 * routes that are only relevant on minds.com
 */
@Injectable()
export class MindsOnlyRedirectGuard {
  constructor(
    private isTenant: IsTenantService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.isTenant.is()) {
      return true; // Allow navigation only if user is on minds.com
    } else {
      console.error(
        'Route not allowed on tenant sites. Redirecting to newsfeed.'
      );
      this.router.navigate(['/']);
      return false; // Prevent navigation
    }
  }
}
