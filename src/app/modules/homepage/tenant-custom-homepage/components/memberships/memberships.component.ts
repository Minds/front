import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Observable,
  Subscription,
  distinctUntilChanged,
  filter,
  take,
} from 'rxjs';
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
import { TenantCustomHomepageService } from '../../services/tenant-custom-homepage.service';

/**
 * Memberships display component for custom tenant homepage.
 */
@Component({
  selector: 'm-customTenantHomepage__memberships',
  templateUrl: 'memberships.component.html',
  styleUrls: ['memberships.component.ng.scss'],
})
export class TenantCustomHomepageMembershipsComponent
  extends AbstractSubscriberComponent
  implements OnInit, OnDestroy
{
  // subscription to initialization.
  private initSubscription: Subscription;

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
    private tenantCustomHomepageService: TenantCustomHomepageService,
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

    this.initSubscription = this.siteMembershipService.initialized$
      .pipe(filter(Boolean), take(1))
      .subscribe(() => {
        this.tenantCustomHomepageService.isMembersSectionLoaded$.next(true);
      });
  }

  ngOnDestroy(): void {
    this.initSubscription?.unsubscribe();
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
