import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  SiteMembership,
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
} from '../../../../../graphql/generated.engine';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../common/common.module';

/**
 * Card for displaying a breif summary of membership info, whilst providing
 * the user an option to join a membership or edit a current membership plan.
 */
@Component({
  selector: 'm-membershipCard',
  templateUrl: 'membership-card.component.html',
  styleUrls: ['./membership-card.component.ng.scss'],
  imports: [NgCommonModule, CommonModule],
  standalone: true,
})
export class MembershipCardComponent {
  /** Enum for use in template. */
  public readonly SiteMembershipBillingPeriodEnum: typeof SiteMembershipBillingPeriodEnum = SiteMembershipBillingPeriodEnum;

  /** Enum for use in template. */
  public readonly SiteMembershipPricingModelEnum: typeof SiteMembershipPricingModelEnum = SiteMembershipPricingModelEnum;

  /** Name of the membership. Used as a title. */
  @Input() public readonly name: string = '';

  /** Description of the membership. */
  @Input() public readonly description: string = '';

  /** Price of membership in cents. */
  @Input() public readonly priceInCents: number = null;

  /** Currency of the membership. */
  @Input() public readonly priceCurrencyCode: string = 'USD';

  /** Billing period of the membership in cents. */
  @Input()
  public readonly billingPeriod: SiteMembershipBillingPeriodEnum = null;

  /** Pricing model of the membership, e.g. recurring or one-time. */
  @Input() public readonly pricingModel: SiteMembershipPricingModelEnum = null;

  /** Whether the user is a member. */
  @Input() public isMember: boolean = true;

  /** Whether the action buttons should be considered as having an action in progress . */
  @Input() public inProgress: boolean = false;

  /** Emits when a user clicks to join a membership. */
  @Output('joinMembershipClick')
  public readonly joinMembershipClickEmitter: EventEmitter<
    SiteMembership
  > = new EventEmitter<SiteMembership>();

  /** Emits when a user clicks to manage their plan. */
  @Output('managePlanClick')
  public readonly managePlanClickEmitter: EventEmitter<
    SiteMembership
  > = new EventEmitter<SiteMembership>();
}
