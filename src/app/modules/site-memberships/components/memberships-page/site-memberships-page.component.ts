import {
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ConfigsService } from '../../../../common/services/configs.service';
import { SiteMembership } from '../../../../../graphql/generated.engine';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subscription,
  map,
  of,
  switchMap,
} from 'rxjs';
import { ToasterService } from '../../../../common/services/toaster.service';
import { getCurrencySymbol, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SiteMembershipService } from '../../services/site-memberships.service';

/** Membership error messages. */
export enum SiteMembershipPageErrorMessage {
  SUBSCRIPTION_ALREADY_CANCELLED = 'This subscription is already cancelled',
  SUBSCRIPTION_ALREADY_EXISTS = 'You are already subscribed to this membership',
}

export type SiteMembershipsPageModalData = {
  isModal: boolean;
  skipInitialFetch: boolean;
  showDismissActions?: boolean;
  onDismissIntent: () => any;
  onJoinClick: () => any;
};

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
  public readonly initialized$: BehaviorSubject<boolean> =
    this.siteMembershipsService.initialized$;

  /** Array of memberships */
  public readonly memberships$: ReplaySubject<SiteMembership[]> =
    this.siteMembershipsService.siteMemberships$;

  /** Whether navigation and pre-cursor calls are in progress. */
  public readonly navigationInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Localised text of the star-card title. */
  public starCardTitleText: string = null;

  /** Localised text of the star-card description. */
  public starCardDescriptionText$: Observable<string>;

  /** Component-level subscriptions array. */
  private subscriptions: Subscription[] = [];

  /** Whether to show 'Memberships' at the top of the page */
  public showPageTitle$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /** Whether initial fetch should be skipped. */
  private skipInitialFetch: boolean = false;

  /** Whether to show dismiss actions. */
  public showDismissActions: boolean = true;

  /** True if this is being displayed as a modal */
  @HostBinding('class.m-membershipsPage__modal')
  isModal: boolean = false;

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  /**
   * User joined a site membership
   */
  onJoinClick: () => void = () => {};

  constructor(
    private siteMembershipsService: SiteMembershipService,
    private toaster: ToasterService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    readonly configs: ConfigsService
  ) {}

  ngOnInit(): void {
    if (!this.skipInitialFetch) {
      this.fetchAllData();
    }

    this.checkForErrorParams();

    this.subscriptions.push(
      this.route.queryParamMap.subscribe((params) => {
        if (params.has('membershipRedirect')) {
          this.starCardTitleText = $localize`:@@MEMBERSHIPS__THIS_MEMBERSHIP_IS_NO_LONGER_AVAILABLE:This membership is no longer available`;
        } else {
          this.starCardTitleText = $localize`:@@MEMBERSHIPS__BECOME_A_SUPPORTING_MEMBER:Become a supporting member`;
        }
      })
    );

    this.starCardDescriptionText$ = this.route.queryParamMap.pipe(
      map((params) => {
        const membershipRedirect = params.get('membershipRedirect');
        const siteName = this.configs.get('site_name');

        if (
          this.isModal &&
          this.configs.get('tenant')?.['should_show_membership_gate']
        ) {
          return $localize`:@@MEMBERSHIPS__THIS_COMMUNITY_IS_EXCLUSIVELY_FOR_SUPPORTING_MEMBERS_JOIN_TODAY:This community is exclusively for supporting members. Join today.`;
        }

        if (membershipRedirect) {
          this.showPageTitle$.next(false);
          return $localize`:@@MEMBERSHIPS__OTHER_AVAILABLE_MEMBERSHIPS:Check out these other available memberships from ${siteName}:site name:.`;
        }

        return $localize`:@@MEMBERSHIPS__JOIN_AND_SUPPORT_TO_UNLOCK_MEMBERS_ONLY_ACCESS:Join and support ${siteName}:site name: to unlock members-only access.`;
      })
    );
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
    this.siteMembershipsService.fetch(true);
  }

  /**
   * Check for error query params and display an error message if necessary.
   * @returns { void }
   */
  private checkForErrorParams(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Bounce to back of event queue to avoid a race condition with lazy loading.
      setTimeout(() => {
        const errorQueryParam: string =
          this.route.snapshot.queryParamMap.get('error');
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
   * Set modal data.
   * @param { SiteMembershipsPageModalData } data - data for modal version of this component
   */
  public setModalData({
    isModal,
    onDismissIntent,
    onJoinClick,
    skipInitialFetch,
    showDismissActions,
  }: SiteMembershipsPageModalData) {
    this.isModal = isModal;
    if (this.isModal) {
      this.showPageTitle$.next(false);
    }
    this.showDismissActions = showDismissActions ?? true;
    this.onDismissIntent = onDismissIntent ?? (() => {});
    this.onJoinClick = onJoinClick ?? (() => {});
    this.skipInitialFetch = skipInitialFetch ?? false;
  }

  /**
   * Get modal options.
   * @returns { { canDismiss: () => Promise<boolean> } }
   */
  public getModalOptions(): { canDismiss: () => Promise<boolean> } {
    return {
      canDismiss: async (): Promise<boolean> => {
        return !this.configs.get('tenant')?.['should_show_membership_gate'];
      },
    };
  }
}
