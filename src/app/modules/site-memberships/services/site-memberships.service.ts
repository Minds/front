import { Inject, Injectable } from '@angular/core';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../common/services/toaster.service';
import {
  GetSiteMembershipsAndSubscriptionsGQL,
  SiteMembership,
  SiteMembershipSubscription,
} from '../../../../graphql/generated.engine';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  lastValueFrom,
  map,
} from 'rxjs';

/**
 * Service to return site memberships
 */
@Injectable({ providedIn: 'root' })
export class SiteMembershipService {
  /** Whether service can be consider as initialized. */
  public readonly initialized$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  /** Array of memberships */
  public readonly siteMemberships$: ReplaySubject<
    SiteMembership[]
  > = new ReplaySubject();

  /** Array of the logged in users membership subscriptions. */
  public readonly siteMembershipSubscriptions$: ReplaySubject<
    SiteMembershipSubscription[]
  > = new ReplaySubject();

  /** Mapped array of membership subscription GUIDs */
  public siteMembershipSubscriptionGuids$: Observable<
    string[]
  > = this.siteMembershipSubscriptions$.pipe(
    map((subscriptions: SiteMembershipSubscription[]): string[] => {
      return subscriptions.map(
        (subscription: SiteMembershipSubscription): string =>
          subscription.membershipGuid
      );
    })
  );

  constructor(
    private getSiteMembershipsAndSubscriptionsGQL: GetSiteMembershipsAndSubscriptionsGQL,
    private toaster: ToasterService
  ) {}

  /**
   * Batch load site memberships and subscriptions into service state.
   */
  public async fetch(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.getSiteMembershipsAndSubscriptionsGQL.fetch(null, {
          fetchPolicy: 'network-only',
        })
      );

      if (response.errors?.length || !response?.data?.siteMemberships) {
        throw response.errors ?? 'No data';
      }

      this.siteMemberships$.next(
        response.data.siteMemberships as SiteMembership[]
      );

      if (response.data.siteMembershipSubscriptions?.length) {
        this.siteMembershipSubscriptions$.next(
          response.data.siteMembershipSubscriptions
        );
      }
    } catch (error) {
      console.error(error);
      this.toaster.error(DEFAULT_ERROR_MESSAGE);
    } finally {
      this.initialized$.next(true);
    }
  }

  /**
   * Get the lowest price membership from an array of memberships.
   * @param { SiteMembership[] } memberships - The array of memberships.
   * @returns { SiteMembership } The lowest price membership.
   */
  public getLowestPriceMembershipFromArray(
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
