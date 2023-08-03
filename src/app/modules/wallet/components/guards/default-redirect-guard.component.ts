/**
 * Redirects to route set in WalletTabHistoryService
 * if one exists.
 * @author Ben Hayward
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { WalletTabHistoryService } from '../tab-history.service';
import { GiftCardClaimExperimentService } from '../../../experiments/sub-services/gift-card-claim-experiment.service';

@Injectable()
export class DefaultRedirectGuard implements CanActivate {
  constructor(
    private router: Router,
    private tabHistory: WalletTabHistoryService,
    private giftCardClaimExperimentService: GiftCardClaimExperimentService
  ) {}

  /**
   * Returns false, and handles conditional redirect
   * dependant on whether history is set in WalletTabHistoryService
   * @returns false
   */
  canActivate() {
    const lastTab = this.tabHistory.lastTab;

    if (lastTab) {
      // if the experiment is NOT active for the credits tab, send to token rewards instead.
      // This if statement can be removed when experiment is removed.
      if (
        lastTab.includes('credits/') &&
        !this.giftCardClaimExperimentService.isActive()
      ) {
        this.router.navigateByUrl('/wallet/tokens/rewards');
        return true;
      }
      this.router.navigateByUrl(`/wallet${lastTab}`);
      return false;
    }

    // default redirect
    this.router.navigateByUrl('/wallet/tokens/rewards');
    return true;
  }
}
