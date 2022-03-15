import { Injectable } from '@angular/core';
import { Session } from '../../services/session';

/**
 * Central place for logic determining the link a user should be directed to
 * For access to the helpdesk.
 */
@Injectable({ providedIn: 'root' })
export class HelpdeskRedirectService {
  constructor(private session: Session) {}

  /**
   * Gets URL for helpdesk - if logged in it will redirect to our API endpoint
   * that handles authentication via JWT. If logged out it will return the link
   * direct to the helpdesk, without logging in.
   * @returns { string } - url for helpdesk.
   */
  public getUrl(): string {
    return this.session.isLoggedIn()
      ? '/api/v3/helpdesk/zendesk'
      : 'https://support.minds.com/';
  }
}
