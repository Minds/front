import { Inject, Injectable } from '@angular/core';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { Location } from '@angular/common';

/**
 * Service for determining whether a shorter minimal mode
 * version of onboarding should be shown.
 *
 * Minimal means "only show the email verification step"
 * Used for tenants and also when onboarding from specific routes.
 */
@Injectable({ providedIn: 'root' })
export class OnboardingV5MinimalModeService {
  /** Routes that should always force minimal mode to be used. */
  private readonly forcedMinimalModeRoutes: string[] = [
    '/about/networks',
    '/networks/checkout',
  ];

  constructor(
    private location: Location,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean
  ) {}

  /**
   * Whether minimal mode should be shown.
   * @returns { boolean } whether minimal mode should be shown.
   */
  public shouldShow(): boolean {
    if (this.isTenantNetwork) {
      return true;
    }

    const currentPath: string = this.location.path();
    for (const route of this.forcedMinimalModeRoutes) {
      if (currentPath.includes(route)) {
        return true;
      }
    }

    return false;
  }
}
