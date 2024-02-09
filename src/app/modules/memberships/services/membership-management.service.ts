import { Inject, Injectable } from '@angular/core';
import { ToasterService } from '../../../common/services/toaster.service';
import { WINDOW } from '../../../common/injection-tokens/common-injection-tokens';

/**
 * Service to handle user actions to manage memberships, either by linking
 * to purchase a new one or linking to  manage an existing plan.
 */
@Injectable({ providedIn: 'root' })
export class MembershipManagementService {
  constructor(
    private toaster: ToasterService,
    @Inject(WINDOW) private window: Window
  ) {}

  /**
   * Open checkout page for a membership.
   * @param { string } siteMembershipGuid - The site membership guid.
   * @param { string } redirectUri - The redirect url for after checkout.
   * @returns { Promise<boolean> } - true on success.
   */
  public async navigateToCheckout(
    siteMembershipGuid: string,
    redirectUri: string = '/memberships'
  ): Promise<boolean> {
    try {
      if (!siteMembershipGuid) {
        throw new Error('siteMembershipGuid not provided to checkout function');
      }
      this.window.open(
        `/api/v3/payments/site-memberships/${siteMembershipGuid}/checkout?redirectUri=${redirectUri}`,
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
   * Open manage plan page for a membership.
   * @param { string } subscriptionId - The GUID of the subscription that we want to navigate to..
   * @param { string } redirectUri - The redirect url for after manage plan.
   * @returns { Promise<boolean> } - true on success.
   */
  public async navigateToManagePlan(
    subscriptionId: number,
    redirectUri: string = '/memberships'
  ): Promise<boolean> {
    try {
      if (!subscriptionId) {
        throw new Error('subscriptionId not provided to checkout function');
      }
      this.window.open(
        `/api/v3/payments/site-memberships/subscriptions/${subscriptionId}/manage?redirectUri=${redirectUri}`,
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
}
