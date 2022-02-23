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

  public getRedirectUrl(): string {
    if (
      this.isRegistration() &&
      this.isOnHomepage() &&
      this.shouldUseExperiment()
    ) {
      return '/discovery/top';
    } else {
      return '/newsfeed/subscriptions';
    }
  }

  /**
   *
   * @returns If user registered their account within the
   * last 5 minutes
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

  public isOnHomepage(): boolean {
    return this.router.url === '/' || this.router.url === '/about';
  }
}
