import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
import { Session } from '../../../../services/session';
import { SiteMembershipManagementService } from '../../services/site-membership-management.service';
import {
  GetSiteMembershipSubscriptionsGQL,
  GetSiteMembershipSubscriptionsQuery,
  SiteMembership,
  SiteMembershipPricingModelEnum,
  SiteMembershipSubscription,
} from '../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../common/services/toaster.service';
import { MindsUser } from '../../../../interfaces/entities';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subscription,
  filter,
  firstValueFrom,
  map,
  take,
  tap,
} from 'rxjs';
import { SiteMembershipService } from '../../services/site-memberships.service';
import { OnboardingV5Service } from '../../../onboarding-v5/services/onboarding-v5.service';
import { ApolloQueryResult } from '@apollo/client';

@Component({
  selector: 'm-joinManageSiteMembershipButton',
  templateUrl: './join-manage-membership-button.component.html',
  styleUrls: ['./join-manage-membership-button.component.ng.scss'],
})
export class JoinManageSiteMembershipButtonComponent implements OnInit {
  @Input() membershipGuid: string;

  membership$: Observable<SiteMembership | null>;

  /** Component-level subscriptions array. */
  private subscriptions: Subscription[] = [];

  private membershipSubscriptionsSnapshot: SiteMembershipSubscription[];

  /** Array of the logged in users membership subscriptions. */
  private readonly membershipSubscriptions$: ReplaySubject<
    SiteMembershipSubscription[]
  > = this.siteMembershipService.siteMembershipSubscriptions$;

  /** Mapped array of membership subscription GUIDs */
  public membershipSubscriptionGuids$: Observable<string[]> =
    this.siteMembershipService.siteMembershipSubscriptionGuids$;

  /** Whether navigation and pre-cursor calls are in progress. */
  public readonly navigationInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether component can be consider as initialized. */
  public readonly initialized$: BehaviorSubject<boolean> =
    this.siteMembershipService.initialized$;

  public isMember$: Observable<boolean>;

  /** Enum for use in template. */
  public readonly SiteMembershipPricingModelEnum: typeof SiteMembershipPricingModelEnum =
    SiteMembershipPricingModelEnum;

  constructor(
    private authModal: AuthModalService,
    private session: Session,
    private membershipManagement: SiteMembershipManagementService,
    private toaster: ToasterService,
    private siteMembershipService: SiteMembershipService,
    private onboardingV5Service: OnboardingV5Service,
    private getSiteMembershipSubscriptionsGQL: GetSiteMembershipSubscriptionsGQL
  ) {}

  ngOnInit(): void {
    if (!this.membershipGuid) {
      console.error('Membership GUID not provided');
      return;
    }
    this.fetchAllData();
    this.membership$ = this.siteMembershipService.siteMemberships$.pipe(
      map(
        (memberships) =>
          memberships.find((m) => m.membershipGuid === this.membershipGuid) ||
          null
      ),
      tap((membership) => {
        if (!membership) {
          // Membership guid isn't found in siteMemberships$
          this.toaster.error('Membership not found');
        }
      })
    );

    this.isMember$ =
      this.siteMembershipService.siteMembershipSubscriptionGuids$.pipe(
        map((guids) => guids.includes(this.membershipGuid))
      );

    this.subscriptions.push(
      this.membershipSubscriptions$.subscribe(
        (membershipSubscriptions) =>
          (this.membershipSubscriptionsSnapshot = membershipSubscriptions)
      )
    );
  }

  public async onJoinMembershipClick(): Promise<void> {
    if (this.session.isLoggedIn()) {
      this.navigateToCheckout();
      return;
    }

    const result: MindsUser = await this.authModal.open({
      formDisplay: 'register',
    });

    // modal closed.
    if (!result) return;

    // on login, if email is already confirmed, call the action again.
    if (result.email_confirmed) {
      this.navigateToCheckout();
      return;
    }

    // listen for onboarding handler and call the action on completion.
    this.subscriptions.push(
      this.onboardingV5Service.onboardingCompleted$
        .pipe(filter(Boolean), take(1))
        .subscribe((completed: boolean): void => {
          this.navigateToCheckout();
        })
    );
  }

  /**
   * Handle manage plan click.
   * @returns { Promise<void> }
   */
  public async onManagePlanClick(): Promise<void> {
    this.navigationInProgress$.next(true);

    const membershipSubscriptionId: number = this.getMembershipSubscriptionId();

    if (!membershipSubscriptionId) {
      this.toaster.warn('You are not subscribed to this membership.');
      this.navigationInProgress$.next(false);
      return;
    }

    if (
      !(await this.membershipManagement.navigateToManagePlan(
        membershipSubscriptionId,
        '/memberships'
      ))
    ) {
      this.navigationInProgress$.next(false);
    }
  }

  /**
   * Navigate to checkout for a membership. Will first re-check a members membership subscription GUIDs to ensure
   * that they are not already subscribed to the membership, in case there has been a change in another GetSiteMembershipSubscriptionsGQL
   * or they have just logged in.
   * @returns { Promise<void> }
   */
  private async navigateToCheckout(): Promise<void> {
    this.navigationInProgress$.next(true);

    // refetch membership subscription guids.
    const membershipSubscriptionGuids: string[] = await firstValueFrom(
      this.getSiteMembershipSubscriptionsGQL
        .fetch(null, {
          fetchPolicy: 'network-only',
        })
        .pipe(
          map(
            (
              response: ApolloQueryResult<GetSiteMembershipSubscriptionsQuery>
            ): string[] => {
              if (
                response.errors?.length ||
                !response?.data?.siteMembershipSubscriptions?.length
              ) {
                return [];
              }
              return response.data.siteMembershipSubscriptions.map(
                (subscription: SiteMembershipSubscription): string =>
                  subscription.membershipGuid
              );
            }
          )
        )
    );

    // if they are already a member, re-init to ensure we get their correct state.
    if (membershipSubscriptionGuids.includes(this.membershipGuid)) {
      this.toaster.warn('You are already subscribed to this membership.');
      this.navigationInProgress$.next(false);
      this.initialized$.next(false);
      this.fetchAllData(true);
      return;
    }

    // navigate to checkout.
    if (
      !(await this.membershipManagement.navigateToCheckout(
        this.membershipGuid,
        '/memberships'
      ))
    ) {
      this.navigationInProgress$.next(false);
    }
  }

  /**
   * Batch load site memberships and subscriptions into component state.
   * @returns { void }
   */
  private fetchAllData(useNetworkOnly: boolean = false): void {
    this.siteMembershipService.fetch(useNetworkOnly);
  }

  /**
   * Get the membership subscription ID for a membership.
   * @param { SiteMembership } siteMembership - The site membership to get the subscription ID for.
   * @returns { number } The membership subscription ID.
   */
  public getMembershipSubscriptionId(): number {
    const subscriptions: SiteMembershipSubscription[] =
      this.membershipSubscriptionsSnapshot;
    if (!subscriptions?.length) return null;
    return (
      subscriptions.find(
        (subscription: SiteMembershipSubscription): boolean =>
          subscription.membershipGuid === this.membershipGuid
      )?.membershipSubscriptionId ?? null
    );
  }
}
