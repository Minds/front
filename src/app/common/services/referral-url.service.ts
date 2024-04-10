import { Injectable } from '@angular/core';
import { Session } from '../../services/session';
import { ConfigsService } from './configs.service';

/**
 * Central service for the getting of a users referrer URL.
 */
@Injectable({ providedIn: 'root' })
export class ReferralUrlService {
  // base url for site from config.
  private readonly siteUrl: string;

  constructor(
    private session: Session,
    config: ConfigsService
  ) {
    this.siteUrl = config.get('site_url');
  }

  /**
   * Gets referral URL.
   * @returns { string } referral URL for user.
   */
  public get(): string {
    return `${this.siteUrl}register?referrer=${
      this.session.getLoggedInUser().username
    }`;
  }
}
