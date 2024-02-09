import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { MembershipsCountService } from '../services/membership-count.service';

/**
 * Guard to check that a user should be able to visit the memberships page.
 */
@Injectable({ providedIn: 'root' })
export class MembershipsRouteGuard implements CanActivate {
  constructor(
    private membershipsCountService: MembershipsCountService,
    private router: Router,
    @Inject(IS_TENANT_NETWORK) private isTenantNetwork: boolean
  ) {}

  /**
   * Check if the user should be able to visit the memberships page.
   * @returns { boolean }
   */
  canActivate(): boolean {
    if (
      !this.isTenantNetwork ||
      this.membershipsCountService.count$.getValue() < 1
    ) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }
}
