import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BehaviorSubject,
  Subscription,
  filter,
  lastValueFrom,
  take,
} from 'rxjs';
import { TenantInviteLinkType } from '../../invite.types';
import {
  GetSiteMembershipsGQL,
  GetSiteMembershipsQuery,
  SiteMembership,
} from '../../../../../../../../graphql/generated.engine';
import { ApolloQueryResult } from '@apollo/client';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../../../../common/services/toaster.service';
import { ConfigsService } from '../../../../../../../common/services/configs.service';

/**
 * Tenant admins can copy invite links here
 * Either for the network in general or a specific memberhsip
 */
@Component({
  selector: 'm-networkAdminConsoleInvite__link',
  templateUrl: './link.component.html',
  styleUrls: [
    './link.component.ng.scss',
    '../../../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleInviteLinkComponent
  implements OnInit, OnDestroy {
  form: FormGroup;

  /** Whether loading is in progress. */
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  subscriptions: Subscription[] = [];

  /** Site memberships array. */
  public memberships: SiteMembership[] = [];

  /**
   * Allows us to use enum in the template
   */
  public TenantInviteLinkType: typeof TenantInviteLinkType = TenantInviteLinkType;

  readonly siteUrl: string = '';

  showDefaultLink: boolean = true;
  showMembershipLinks: boolean = false;

  constructor(
    private fb: FormBuilder,
    private getSiteMembershipsGQL: GetSiteMembershipsGQL,
    private toaster: ToasterService,
    configs: ConfigsService
  ) {
    this.siteUrl = configs.get('site_url');
  }

  ngOnInit(): void {
    this.fetchMemberships();

    this.subscriptions.push(
      this.form.get('linkType').valueChanges.subscribe(value => {
        this.showDefaultLink = value === TenantInviteLinkType.DEFAULT;
        this.showMembershipLinks = value === TenantInviteLinkType.MEMBERSHIP;
      })
    );
  }

  /**
   * Fetches memberships from the server.
   * @returns { Promise<void> }
   */
  public async fetchMemberships(): Promise<void> {
    this.loading$.next(true);

    try {
      const response: ApolloQueryResult<GetSiteMembershipsQuery> = await lastValueFrom(
        this.getSiteMembershipsGQL.fetch()
      );

      if (response?.error || response?.errors?.length) {
        console.error(response?.errors ?? DEFAULT_ERROR_MESSAGE);
        throw new Error('An error has occurred while loading memberships');
      }

      if (response?.data?.siteMemberships?.length) {
        this.memberships = response?.data?.siteMemberships as SiteMembership[];
      }
    } catch (e) {
      console.error(e);
      this.toaster.error(e);
    } finally {
      this.setUpForm();
      this.loading$.next(false);
    }
  }

  setUpForm(): void {
    this.form = this.fb.group({
      linkType: [TenantInviteLinkType.DEFAULT],
    });
  }

  getUrlToCopy(membership?: SiteMembership) {
    if (membership) {
      return `${this.siteUrl}memberships/join/${membership.membershipGuid}`;
    } else {
      return this.siteUrl;
    }
  }

  getCopySuccessMessage(membership?: SiteMembership) {
    const successMessagePrefix = membership
      ? membership.membershipName
      : 'Network';

    return successMessagePrefix + ' link copied to clipboard';
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
