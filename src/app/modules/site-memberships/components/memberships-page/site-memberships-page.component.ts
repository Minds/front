import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ConfigsService } from '../../../../common/services/configs.service';
import {
  GetSiteMembershipSubscriptionsGQL,
  GetSiteMembershipSubscriptionsQuery,
  GetSiteMembershipsAndSubscriptionsGQL,
  GetSiteMembershipsAndSubscriptionsQuery,
  SiteMembership,
  SiteMembershipSubscription,
} from '../../../../../graphql/generated.engine';
import { ApolloQueryResult } from '@apollo/client';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subscription,
  catchError,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  map,
  take,
} from 'rxjs';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../common/services/toaster.service';
import { getCurrencySymbol, isPlatformBrowser } from '@angular/common';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
import { OnboardingV5Service } from '../../../onboarding-v5/services/onboarding-v5.service';
import { MindsUser } from '../../../../interfaces/entities';
import { Session } from '../../../../services/session';
import { SiteMembershipManagementService } from '../../services/site-membership-management.service';
import { ActivatedRoute } from '@angular/router';

/** Membership error messages. */
export enum SiteMembershipPageErrorMessage {
  SUBSCRIPTION_ALREADY_CANCELLED = 'This subscription is already cancelled',
  SUBSCRIPTION_ALREADY_EXISTS = 'You are already subscribed to this membership',
}

/**
 * Base site memberships page component.
 */
@Component({
  selector: 'm-siteMembershipsPage',
  templateUrl: 'site-memberships-page.component.html',
  styleUrls: ['./site-memberships-page.component.ng.scss'],
})
export class SiteMembershipsPageComponent implements OnInit, OnDestroy {
  /** Whether component can be consider as initialized. */
  public readonly initialized$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /** Array of memberships */
  public readonly memberships$: BehaviorSubject<
    SiteMembership[]
  > = new BehaviorSubject<SiteMembership[]>([]);

  /** Array of the logged in users membership subscriptions. */
  private readonly membershipSubscriptions$: BehaviorSubject<
    SiteMembershipSubscription[]
  > = new BehaviorSubject<SiteMembershipSubscription[]>([]);

  /** Mapped array of membership subscription GUIDs */
  public membershipSubscriptionGuids$: Observable<
    string[]
  > = this.membershipSubscriptions$.pipe(
    map((subscriptions: SiteMembershipSubscription[]): string[] => {
      return subscriptions.map(
        (subscription: SiteMembershipSubscription): string =>
          subscription.membershipGuid
      );
    })
  );

  /** Whether navigation and pre-cursor calls are in progress. */
  public readonly navigationInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Localised text of the star-card title. */
  public readonly starCardTitleText: string = null;

  /** Description text for star card */
  public readonly starCardDescriptionText$: Observable<
    string
  > = this.memberships$.pipe(
    distinctUntilChanged(),
    map((memberships: SiteMembership[]): string => {
      if (!memberships?.length) return null;

      const lowestPriceMembership: SiteMembership = this.getLowestPriceMembershipFromArray(
        memberships
      );
      if (!lowestPriceMembership) return null;

      const currencySymbol: string =
        getCurrencySymbol(lowestPriceMembership.priceCurrency, 'narrow') ?? '$';
      return $localize`:@@MEMBERSHIPS__MEMBERSHIPS_START_AT_X_PER_MONTH:Memberships start at ${currencySymbol}${lowestPriceMembership.membershipPriceInCents /
        100}`;
    })
  );

  /** Component-level subscriptions array. */
  private subscriptions: Subscription[] = [];

  constructor(
    private membershipManagement: SiteMembershipManagementService,
    private getSiteMembershipsAndSubscriptionsGQL: GetSiteMembershipsAndSubscriptionsGQL,
    private getSiteMembershipSubscriptionsGQL: GetSiteMembershipSubscriptionsGQL,
    private authModal: AuthModalService,
    private onboardingV5Service: OnboardingV5Service,
    private toaster: ToasterService,
    private session: Session,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    readonly configs: ConfigsService
  ) {
    this.starCardTitleText = $localize`:@@MEMBERSHIPS__UNLEASH_THE_FULL_MINDS_EXPERIENCE:Unleash the full ${configs.get(
      'site_name'
    )} experience`;
  }

  ngOnInit(): void {
    this.fetchAllData();
    this.checkForErrorParams();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription?.unsubscribe();
    }
  }

  /**
   * Batch load site memberships and subscriptions into component state.
   * @returns { void }
   */
  private fetchAllData(): void {
    this.subscriptions.push(
      this.getSiteMembershipsAndSubscriptionsGQL
        .fetch(null, {
          fetchPolicy: 'network-only',
        })
        .pipe(
          take(1),
          catchError(
            (error: Error): Observable<never> => {
              console.error(error);
              this.toaster.error(DEFAULT_ERROR_MESSAGE);
              this.initialized$.next(true);
              return EMPTY;
            }
          )
        )
        .subscribe(
          (
            response: ApolloQueryResult<GetSiteMembershipsAndSubscriptionsQuery>
          ): void => {
            if (response.errors?.length || !response?.data?.siteMemberships) {
              console.error(response.errors ?? 'No data');
              this.toaster.error(DEFAULT_ERROR_MESSAGE);
              this.initialized$.next(true);
              return;
            }

            this.memberships$.next(
              response.data.siteMemberships as SiteMembership[]
            );

            if (response.data.siteMembershipSubscriptions?.length) {
              this.membershipSubscriptions$.next(
                response.data.siteMembershipSubscriptions
              );
            }

            this.initialized$.next(true);
          }
        )
    );
  }

  /**
   * Handle join membership click, either by navigating to checkout or opening the auth modal
   * and navigating to the checkout on auth success.
   * @param { SiteMembership } siteMembership - The site membership to join.
   * @returns { Promise<void> }
   */
  public async onJoinMembershipClick(
    siteMembership: SiteMembership
  ): Promise<void> {
    if (this.session.isLoggedIn()) {
      this.navigateToCheckout(siteMembership);
      return;
    }

    const result: MindsUser = await this.authModal.open({
      formDisplay: 'register',
    });

    // modal closed.
    if (!result) return;

    // on login, if email is already confirmed, call the action again.
    if (result.email_confirmed) {
      this.navigateToCheckout(siteMembership);
      return;
    }

    // listen for onboarding handler and call the action on completion.
    this.subscriptions.push(
      this.onboardingV5Service.onboardingCompleted$
        .pipe(filter(Boolean), take(1))
        .subscribe((completed: boolean): void => {
          this.navigateToCheckout(siteMembership);
        })
    );
  }

  /**
   * Handle manage plan click.
   * @param { SiteMembership } siteMembership - The site membership to manage.
   * @returns { Promise<void> }
   */
  public async onManagePlanClick(
    siteMembership: SiteMembership
  ): Promise<void> {
    this.navigationInProgress$.next(true);

    const membershipSubscriptionId: number = this.getMembershipSubscriptionId(
      siteMembership
    );

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
   * that they are not already subscribed to the membership, incase there has been a change in another tab
   * or they have just logged in.
   * @param { SiteMembership } siteMembership - The site membership to checkout.
   * @returns { Promise<void> }
   */
  private async navigateToCheckout(
    siteMembership: SiteMembership
  ): Promise<void> {
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
    if (membershipSubscriptionGuids.includes(siteMembership.membershipGuid)) {
      this.toaster.warn('You are already subscribed to this membership.');
      this.navigationInProgress$.next(false);
      this.initialized$.next(false);
      this.fetchAllData();
      return;
    }

    // navigate to checkout.
    if (
      !(await this.membershipManagement.navigateToCheckout(
        siteMembership.membershipGuid,
        '/memberships'
      ))
    ) {
      this.navigationInProgress$.next(false);
    }
  }

  /**
   * Check for error query params and display an error message if necessary.
   * @returns { void }
   */
  private checkForErrorParams(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Bounce to back of event queue to avoid a race condition with lazy loading.
      setTimeout(() => {
        const errorQueryParam: string = this.route.snapshot.queryParamMap.get(
          'error'
        );
        if (errorQueryParam) {
          const errorMessage: string =
            SiteMembershipPageErrorMessage[errorQueryParam];

          if (errorMessage) {
            this.toaster.error(errorMessage);
          }
        }
      }, 0);
    }
  }

  /**
   * Get the membership subscription ID for a membership.
   * @param { SiteMembership } siteMembership - The site membership to get the subscription ID for.
   * @returns { number } The membership subscription ID.
   */
  private getMembershipSubscriptionId(siteMembership: SiteMembership): number {
    const subscriptions: SiteMembershipSubscription[] = this.membershipSubscriptions$.getValue();
    if (!subscriptions?.length) return null;
    return (
      subscriptions.find(
        (subscription: SiteMembershipSubscription): boolean =>
          subscription.membershipGuid === siteMembership.membershipGuid
      )?.membershipSubscriptionId ?? null
    );
  }

  /**
   * Get the lowest price membership from an array of memberships.
   * @param { SiteMembership[] } memberships - The array of memberships.
   * @returns { SiteMembership } The lowest price membership.
   */
  private getLowestPriceMembershipFromArray(
    memberships: SiteMembership[]
  ): SiteMembership {
    let lowestPriceMembership: SiteMembership = null;
    for (let membership of memberships) {
      if (
        !lowestPriceMembership ||
        membership.membershipPriceInCents <
          lowestPriceMembership?.membershipPriceInCents
      ) {
        lowestPriceMembership = membership;
      }
    }
    return lowestPriceMembership;
  }
}
