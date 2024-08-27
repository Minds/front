import { Inject, Injectable } from '@angular/core';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../common/services/toaster.service';
import {
  GetSiteMembershipGQL,
  GetSiteMembershipsAndSubscriptionsGQL,
  SiteMembership,
  SiteMembershipSubscription,
} from '../../../../graphql/generated.engine';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  catchError,
  lastValueFrom,
  map,
  of,
} from 'rxjs';
import { FetchPolicy } from '@apollo/client';

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
  public readonly siteMemberships$: ReplaySubject<SiteMembership[]> =
    new ReplaySubject();

  /** Array of the logged in users membership subscriptions. */
  public readonly siteMembershipSubscriptions$: ReplaySubject<
    SiteMembershipSubscription[]
  > = new ReplaySubject();

  /** Mapped array of membership subscription GUIDs */
  public siteMembershipSubscriptionGuids$: Observable<string[]> =
    this.siteMembershipSubscriptions$.pipe(
      map((subscriptions: SiteMembershipSubscription[]): string[] => {
        return subscriptions.map(
          (subscription: SiteMembershipSubscription): string =>
            subscription.membershipGuid
        );
      })
    );

  constructor(
    private getSiteMembershipsAndSubscriptionsGQL: GetSiteMembershipsAndSubscriptionsGQL,
    private toaster: ToasterService,
    private getSiteMembershipGQL: GetSiteMembershipGQL
  ) {}

  /**
   * Batch load site memberships and subscriptions into service state.
   * @param [useNetworkOnly=false] true if you the data changes regularly (e.g. when you are managing memberships) to ignore the cache and always make a network call. False by default
   */
  public async fetch(useNetworkOnly: boolean = false): Promise<void> {
    try {
      const fetchPolicy: FetchPolicy = useNetworkOnly
        ? 'network-only'
        : 'cache-first';

      const response = await lastValueFrom(
        this.getSiteMembershipsAndSubscriptionsGQL.fetch(null, {
          fetchPolicy: fetchPolicy,
        })
      );

      if (response.errors?.length || !response?.data?.siteMemberships) {
        throw response.errors ?? 'No data';
      }

      this.siteMemberships$.next(
        response.data.siteMemberships as SiteMembership[]
      );

      this.siteMembershipSubscriptions$.next(
        response.data.siteMembershipSubscriptions ?? []
      );
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

  /**
   * Gets a single membership by membershipGuid
   * @param membershipGuid The guid of the membership to check.
   * @returns SiteMembership
   */
  public loadMembershipByGuid(
    membershipGuid: string
  ): Observable<SiteMembership | null> {
    return this.getSiteMembershipGQL
      .fetch({ membershipGuid: membershipGuid })
      .pipe(
        map((response) => {
          if (!response.data?.siteMembership || response.errors?.length) {
            throw new Error(
              response.errors?.[0]?.message || 'Membership not found'
            );
          }
          return response.data.siteMembership as SiteMembership;
        }),
        catchError((error) => {
          console.error(error);
          this.toaster.error('Failed to load membership details');
          return of(null);
        })
      );
  }
}
