import { Component, OnInit } from '@angular/core';
import { Observable, distinctUntilChanged, filter, take } from 'rxjs';
import {
  SiteMembership,
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
} from '../../../../../../graphql/generated.engine';
import { SiteMembershipService } from '../../../../site-memberships/services/site-memberships.service';
import { MindsUser } from '../../../../../interfaces/entities';
import { AuthModalService } from '../../../../auth/modal/auth-modal.service';
import { OnboardingV5Service } from '../../../../onboarding-v5/services/onboarding-v5.service';
import { SiteMembershipManagementService } from '../../../../site-memberships/services/site-membership-management.service';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';

@Component({
  selector: 'm-customTenantHomepage__memberships',
  templateUrl: 'memberships.component.html',
  styleUrls: ['memberships.component.ng.scss'],
})
export class TenantCustomHomepageMembershipsComponent
  extends AbstractSubscriberComponent
  implements OnInit
{
  /** Enum for use in template. */
  public readonly SiteMembershipBillingPeriodEnum: typeof SiteMembershipBillingPeriodEnum =
    SiteMembershipBillingPeriodEnum;

  /** Enum for use in template. */
  public readonly SiteMembershipPricingModelEnum: typeof SiteMembershipPricingModelEnum =
    SiteMembershipPricingModelEnum;

  /** Site memberships. */
  protected readonly siteMemberships$: Observable<SiteMembership[]> =
    this.siteMembershipService.siteMemberships$.pipe(distinctUntilChanged());

  constructor(
    private siteMembershipService: SiteMembershipService,
    private authModal: AuthModalService,
    private onboardingV5Service: OnboardingV5Service,
    private membershipManagement: SiteMembershipManagementService
  ) {
    super();
  }

  ngOnInit(): void {
    // will populate siteMemberships$ asynchronously.
    this.siteMembershipService.fetch();
  }

  /**
   * Handle join membership click.
   * @param { string } membershipGuid - The membership guid.
   * @returns { Promise<void> }
   */
  public async onJoinMembershipClick(membershipGuid: string): Promise<void> {
    const result: MindsUser = await this.authModal.open({
      formDisplay: 'register',
    });

    // modal closed.
    if (!result) return;

    // on login, if email is already confirmed, call the action again.
    if (result.email_confirmed) {
      this.navigateToCheckout(membershipGuid);
      return;
    }

    // listen for onboarding handler and call the action on completion.
    this.subscriptions.push(
      this.onboardingV5Service.onboardingCompleted$
        .pipe(filter(Boolean), take(1))
        .subscribe((completed: boolean): void => {
          this.navigateToCheckout(membershipGuid);
        })
    );
  }

  /**
   * Navigate to checkout.
   * @param { string } membershipGuid - The membership guid.
   * @returns { Promise<boolean> }
   */
  private async navigateToCheckout(membershipGuid: string): Promise<boolean> {
    return this.membershipManagement.navigateToCheckout(
      membershipGuid,
      '/memberships'
    );
  }
}
