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

  subscriptions: Subscription[] = []; // ojm no need?

  /** Site memberships array. */
  public memberships: SiteMembership[] = [];

  /**
   * Allows us to use enum in the template
   */
  public TenantInviteLinkType: typeof TenantInviteLinkType = TenantInviteLinkType;

  readonly siteUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private getSiteMembershipsGQL: GetSiteMembershipsGQL,
    private toaster: ToasterService,
    configs: ConfigsService
  ) {
    this.siteUrl = configs.get('site_url');
  }

  ngOnInit(): void {
    this.fetchMemberships(); // async.
  }

  /**
   * Fetches memberships from the server.
   * @returns { Promise<void> }
   */
  public async fetchMemberships(): Promise<void> {
    this.loading$.next(true);

    console.log('ojm fetch mem');

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

      console.log('ojm', this.memberships);
    } catch (e) {
      console.error(e);
      this.toaster.error(e);
    } finally {
      this.setUpForm();
      this.loading$.next(false);
      console.log('ojm not loading');
    }
  }

  setUpForm(): void {
    this.form = this.fb.group({
      linkType: [TenantInviteLinkType.DEFAULT],
    });
  }

  // Copy different urls to clipboard depending on button clicked
  copyUrlToClipboard(membership?: SiteMembership) {
    let url;
    if (membership) {
      url = `${this.siteUrl}/memberships/join/${membership.id}`;
    } else {
      url = this.siteUrl;
    }

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toaster.success('Link copied to clipboard');
  }

  get showDefaultLink(): boolean {
    return this.form.get('linkType').value === TenantInviteLinkType.DEFAULT;
  }

  get showMembershipLinks(): boolean {
    return this.form.get('linkType').value === TenantInviteLinkType.MEMBERSHIP;
  }

  ngOnDestroy(): void {
    // ojm remove?
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
