import { Inject, Injectable } from '@angular/core';
import { ToasterService } from '../../../common/services/toaster.service';
import { WINDOW } from '../../../common/injection-tokens/common-injection-tokens';

/**
 * Service to handle user actions to manage site memberships, either by linking
 * to purchase a new one or linking to  manage an existing plan.
 */
@Injectable({ providedIn: 'root' })
export class SiteMembershipManagementService {
  constructor(
    private toaster: ToasterService,
    @Inject(WINDOW) private window: Window
  ) {}

  /**
   * Open checkout page for a site membership.
   * @param { string } siteMembershipGuid - The site membership guid.
   * @param { string } redirectPath - The redirect url for after checkout.
   * @returns { Promise<boolean> } - true on success.
   */
  public async navigateToCheckout(
    siteMembershipGuid: string,
    redirectPath: string = '/memberships'
  ): Promise<boolean> {
    try {
      if (!siteMembershipGuid) {
        throw new Error('siteMembershipGuid not provided to checkout function');
      }

      const extendedRedirectPath =
        this.addMembershipCheckoutRedirectQueryParam(redirectPath);

      this.window.open(
        `/api/v3/payments/site-memberships/${siteMembershipGuid}/checkout?redirectPath=${extendedRedirectPath}`,
        '_self'
      );
      return true;
    } catch (e) {
      console.error(e);
      this.toaster.error(
        'There was an error navigating to the checkout. Please try again later.'
      );
      return false;
    }
  }

  /**
   * Open manage plan page for a site membership.
   * @param { string } subscriptionId - The GUID of the subscription that we want to navigate to.
   * @param { string } redirectPath - The redirect url for after manage plan.
   * @returns { Promise<boolean> } - true on success.
   */
  public async navigateToManagePlan(
    subscriptionId: number,
    redirectPath: string = '/memberships'
  ): Promise<boolean> {
    try {
      if (!subscriptionId) {
        throw new Error('subscriptionId not provided to checkout function');
      }
      this.window.open(
        `/api/v3/payments/site-memberships/subscriptions/${subscriptionId}/manage?redirectPath=${redirectPath}`,
        '_self'
      );
      return true;
    } catch (e) {
      console.error(e);
      this.toaster.error(
        'There was an error navigating to the manage your plan page. Please try again later.'
      );
      return false;
    }
  }

  /**
   * Adds query parameter 'membershipCheckoutRedirect=true' to a redirect URL.
   * @param {string} url - The original URL.
   * @returns {string} - The modified URL with the added query parameter.
   */
  public addMembershipCheckoutRedirectQueryParam(url: string): string {
    const queryParam = 'membershipCheckoutRedirect=true';

    const hasQueryParams = url.includes('?');

    return hasQueryParams ? `${url}&${queryParam}` : `${url}?${queryParam}`;
  }
}
