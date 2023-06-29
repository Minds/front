import { Injectable } from '@angular/core';

/**
 * Currently this service provides the default redirect URL
 * but in future it should be used a centralized redirect service
 * for all logins and registrations
 */
@Injectable()
export class AuthRedirectService {
  /**
   * Gets default redirect URL.
   * @returns { string } redirect URL.
   */
  public getRedirectUrl(): string {
    return '/newsfeed/subscriptions/latest';
  }
}
