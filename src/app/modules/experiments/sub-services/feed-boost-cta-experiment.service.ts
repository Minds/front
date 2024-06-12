import { Inject, Injectable } from '@angular/core';
import { ExperimentsService } from '../experiments.service';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';

/**
 * Service to check if the feed boost cta experiment is active.
 * This controls whether action CTAs for Boosts are shown in a users
 * feeds, rather than just single entity pages.
 */
@Injectable({ providedIn: 'root' })
export class FeedBoostCtaExperimentService {
  constructor(
    private experiments: ExperimentsService,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean
  ) {}

  /**
   * Returns true if the front-5408-feed-boost-cta experiment is active.
   * @returns { boolean } whether front-5408-feed-boost-cta experiment is active.
   */
  public isActive(): boolean {
    return (
      this.isTenantNetwork ||
      this.experiments.hasVariation('minds-4918-feed-boost-cta', 'on')
    );
  }
}
