import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IS_TENANT_NETWORK } from '../injection-tokens/tenant-injection-tokens';
import { TenantLoggedInLandingRedirectService } from '../../modules/multi-tenant-network/services/logged-in-landing-redirect.service';

/**
 * This service provides the default redirect URL
 * for logins and registrations.
 */
@Injectable()
export class AuthRedirectService {
  constructor(
    private router: Router,
    private tenantLoggedInLandingRedirect: TenantLoggedInLandingRedirectService,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean
  ) {}

  public redirect(): Promise<boolean> {
    if (this.isTenantNetwork) {
      this.tenantLoggedInLandingRedirect.redirect();
      return;
    }
    return this.router.navigate([this.getDefaultRedirectUrl()]);
  }

  /**
   * Gets default redirect URL.
   * @returns { string } redirect URL.
   */
  public getDefaultRedirectUrl(): string {
    return this.isTenantNetwork
      ? '/newsfeed/subscriptions/top'
      : '/newsfeed/subscriptions/for-you';
  }
}
