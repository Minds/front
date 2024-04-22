/**
 * Redirects to route set in WalletTabHistoryService
 * if one exists.
 * @author Ben Hayward
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { WalletTabHistoryService } from '../tab-history.service';

@Injectable()
export class DefaultRedirectGuard implements CanActivate {
  constructor(
    private router: Router,
    private tabHistory: WalletTabHistoryService
  ) {}

  /**
   * Returns false, and handles conditional redirect
   * dependant on whether history is set in WalletTabHistoryService
   * @returns false
   */
  canActivate() {
    const lastTab = this.tabHistory.lastTab;

    if (lastTab) {
      this.router.navigateByUrl(`/wallet${lastTab}`);
      return false;
    }

    // default redirect
    this.router.navigateByUrl('/wallet/tokens/rewards');
    return true;
  }
}
