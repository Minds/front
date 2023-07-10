import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Currently this service provides the default redirect URL
 * but in future it should be used a centralized redirect service
 * for all logins and registrations
 */
@Injectable()
export class AuthRedirectService {
  constructor(private router: Router) {}

  public redirect(): Promise<boolean> {
    return this.router.navigate([this.getRedirectUrl()]);
  }

  /**
   * Gets default redirect URL.
   * @returns { string } redirect URL.
   */
  public getRedirectUrl(): string {
    return '/newsfeed/subscriptions/for-you';
  }
}
