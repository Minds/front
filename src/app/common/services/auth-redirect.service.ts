import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IS_TENANT_NETWORK } from '../injection-tokens/tenant-injection-tokens';

/**
 * Currently this service provides the default redirect URL
 * but in future it should be used a centralized redirect service
 * for all logins and registrations
 */
@Injectable()
export class AuthRedirectService {
  constructor(
    private router: Router,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean
  ) {}

  public redirect(): Promise<boolean> {
    return this.router.navigate([this.getRedirectUrl()]);
  }

  /**
   * Gets default redirect URL.
   * @returns { string } redirect URL.
   */
  public getRedirectUrl(): string {
    return this.isTenantNetwork
      ? '/newsfeed/subscriptions/top'
      : '/newsfeed/subscriptions/for-you';
  }
}
