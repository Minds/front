import { FeedAlgorithmHistoryService } from '../services/feed-algorithm-history.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

/**
 * Redirects to route set in FeedAlgorithmHistoryService
 * if one exists
 */
@Injectable()
export class FeedAlgorithmRedirectGuard implements CanActivate {
  constructor(
    private router: Router,
    private feedAlgorithmHistory: FeedAlgorithmHistoryService
  ) {}

  /**
   * Returns false, and handles conditional redirect
   * dependant on whether history is set in FeedAlgorithmHistoryService
   * @returns false
   */
  canActivate() {
    const lastFeedAlgorithm = this.feedAlgorithmHistory.lastAlgorithm;

    if (lastFeedAlgorithm) {
      this.router.navigateByUrl(`/newsfeed/subscriptions/${lastFeedAlgorithm}`);
      return false;
    }

    // default redirect
    this.router.navigateByUrl('/newsfeed/subscriptions/latest');
    return false;
  }
}
