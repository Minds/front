import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { SiteMembershipsCountService } from '../services/site-membership-count.service';

/**
 * Guard to check that a user should be able to visit a site memberships page.
 */
@Injectable({ providedIn: 'root' })
export class SiteMembershipsRouteGuard {
  constructor(
    private membershipsCountService: SiteMembershipsCountService,
    private router: Router,
    @Inject(IS_TENANT_NETWORK) private isTenantNetwork: boolean
  ) {}

  /**
   * Check if the user should be able to visit a site memberships page.
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
