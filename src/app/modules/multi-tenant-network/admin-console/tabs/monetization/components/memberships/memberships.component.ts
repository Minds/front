import { Component, OnInit } from '@angular/core';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import {
  GetSiteMembershipsGQL,
  GetSiteMembershipsQuery,
  SiteMembership,
} from '../../../../../../../../graphql/generated.engine';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../../../../common/services/toaster.service';
import { Router } from '@angular/router';
import { StripeKeysService } from '../../services/stripe-keys.service';

/**
 * Tenant admin network memberships settings.
 */
@Component({
  selector: 'm-networkAdminMonetization__memberships',
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.ng.scss'],
})
export class NetworkAdminMonetizationMembershipsComponent implements OnInit {
  /** Whether loading of memberships is in progress. */
  public readonly membershipLoadInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /** Max amount of memberships that a user is permitted. */
  public readonly maxMemberships: number;

  /** Max amount of memberships that a user is permitted as a string. */
  public readonly maxMembershipsString: string;

  /** Site memberships array. */
  public readonly memberships$: BehaviorSubject<SiteMembership[]> =
    new BehaviorSubject<SiteMembership[]>([]);

  /** Whether a user has set stripe keys already. */
  public readonly hasSetStripeKeys$: Observable<boolean> =
    this.stripeKeysService.hasSetStripeKeys$;

  constructor(
    private getSiteMembershipsGQL: GetSiteMembershipsGQL,
    private stripeKeysService: StripeKeysService,
    private toaster: ToasterService,
    private router: Router,
    configs: ConfigsService
  ) {
    this.maxMemberships = configs.get('tenant')['max_memberships'];

    if (this.maxMemberships) {
      this.maxMembershipsString = $localize`:@@NETWORK_ADMIN_MEMBERSHIPS__YOUR_PLAN_ALLOWS: Your plan allows a maximum of ${this.maxMemberships} memberships.`;
    }
  }

  ngOnInit(): void {
    this.fetchMemberships(); // async.

    if (
      !this.stripeKeysService.initialized$.getValue() &&
      !this.stripeKeysService.fetchInProgress$.getValue()
    ) {
      this.stripeKeysService.fetchStripeKeys(); // async
    }
  }

  /**
   * Fetches memberships from the server.
   * @returns { Promise<void> }
   */
  public async fetchMemberships(): Promise<void> {
    this.membershipLoadInProgress$.next(true);

    try {
      const response: ApolloQueryResult<GetSiteMembershipsQuery> =
        await lastValueFrom(
          this.getSiteMembershipsGQL.fetch(null, {
            fetchPolicy: 'network-only',
          })
        );

      if (response?.error || response?.errors?.length) {
        console.error(response?.errors ?? DEFAULT_ERROR_MESSAGE);
        throw new Error('An error has occurred while loading memberships');
      }

      if (response?.data?.siteMemberships?.length) {
        this.memberships$.next(
          response?.data?.siteMemberships as SiteMembership[]
        );
      }
    } catch (e) {
      console.error(e);
      this.toaster.error(e);
    } finally {
      this.membershipLoadInProgress$.next(false);
    }
  }

  /**
   * Handles clicks on the create button.
   * @returns { void }
   */
  public onCreateButtonClick(): void {
    if (this.membershipLoadInProgress$.getValue()) {
      this.toaster.warn('Please wait for the component to finish loading.');
      return;
    }

    if (this.maxMemberships < this.memberships$.getValue()?.length + 1) {
      this.toaster.error(
        `Your network plan only allows ${this.maxMemberships} memberships. Archive a membership before creating a new one.`
      );
      return;
    }

    this.router.navigateByUrl('/network/admin/monetization/memberships/new');
  }

  /**
   * Handles removal of a given membership from list.
   * @param { string } membershipGuid - Membership guid to remove.
   * @returns { void }
   */
  public removeMembership(membershipGuid: string): void {
    const currentMemberships: SiteMembership[] = this.memberships$.getValue();
    this.memberships$.next(
      currentMemberships.filter(
        (membership: SiteMembership) =>
          membership.membershipGuid !== membershipGuid
      )
    );
  }
}
