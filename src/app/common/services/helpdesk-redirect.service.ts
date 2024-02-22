import { Injectable } from '@angular/core';

/**
 * Central place for logic determining the link a user should be directed to
 * For access to the helpdesk.
 */
@Injectable({ providedIn: 'root' })
export class HelpdeskRedirectService {
  private readonly url: string = 'https://support.minds.com/';

  /**
   * Gets URL for helpdesk.
   * @returns { string } - url for helpdesk.
   */
  public getUrl(): string {
    return this.url;
  }
}
