import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../../services/session';
import { ExperimentsService } from '../experiments.service';
import * as moment from 'moment';

/**
 * Returns whether discovery on register experiment should be used,
 * based upon whether the user has recently registered from homepage
 * and has been assigned the experimental variant
 */
@Injectable({ providedIn: 'root' })
export class DiscoveryRedirectExperimentService {
  constructor(
    private experiments: ExperimentsService,
    private router: Router,
    private session: Session
  ) {}

  /**
   * Returns true if the guest mode experiment is active.
   * @returns { boolean } whether guest mode experiment is active.
   */
  public shouldUseExperiment(): boolean {
    return this.experiments.hasVariation('discovery-redirect', true);
  }

  /**
   * Gets URL to be redirected to on registration, varying
   * based on which experiments are active.
   * @returns { string } url to be redirected to on registration
   */
  public getRedirectUrl(): string {
    if (
      this.isRegistration() &&
      this.isOnRedirectablePage() &&
      this.shouldUseExperiment()
    ) {
      // sub-experiment where we redirect to discovery/suggestions/user or /discovery/top.
      return this.isChannelSuggestionsRedirectExperimentActive()
        ? '/discovery/suggestions/user'
        : '/discovery/top';
    } else {
      // default redirect
      return '/newsfeed/subscriptions';
    }
  }

  /**
   * Whether user has registered their account in the last 5 minutes.
   * @returns { boolean } true if user registered their account within the last 5 minutes.
   */
  private isRegistration(): boolean {
    const user = this.session.getLoggedInUser();
    const fiveMinsAgo = moment().subtract(5, 'minutes');

    if (user && user.time_created) {
      return moment(user.time_created * 1000).isAfter(fiveMinsAgo);
    } else {
      false;
    }
  }

  /**
   * Returns true if the user is on a page should be redirected from.
   * @returns { boolean } true if the user is on a page should be redirected from.
   */
  private isOnRedirectablePage(): boolean {
    return (
      this.router.url === '/' ||
      this.router.url === '/about' ||
      this.router.url === '/register'
    );
  }

  /**
   * Returns true if the channel-suggestions-redirect sub-experiment is active.
   * @returns { boolean } whether channel-suggestions-redirect sub-experiment is active.
   */
  public isChannelSuggestionsRedirectExperimentActive(): boolean {
    return this.experiments.hasVariation('channel-suggestions-redirect', true);
  }
}
