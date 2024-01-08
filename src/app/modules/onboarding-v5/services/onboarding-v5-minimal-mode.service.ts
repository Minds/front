import { Inject, Injectable } from '@angular/core';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { Location } from '@angular/common';

/**
 * Service for determining whether a shorter minimal mode
 * version of onboarding should be shown.
 */
@Injectable({ providedIn: 'root' })
export class OnboardingV5MinimalModeService {
  /** Routes that should always force minimal mode to be used. */
  private readonly forcedMinimalModeRoutes: string[] = ['/about/networks'];

  constructor(
    private location: Location,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean
  ) {}

  /**
   * Whether minimal mode should be shown.
   * @returns { boolean } whether minimal mode should be shown.
   */
  public shouldShow(): boolean {
    return (
      this.isTenantNetwork ||
      this.forcedMinimalModeRoutes.includes(this.location.path())
    );
  }
}
