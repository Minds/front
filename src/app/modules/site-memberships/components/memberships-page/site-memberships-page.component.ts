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
    this.fetchAllData();
    this.checkForErrorParams();

    this.subscriptions.push(
      this.route.queryParamMap.subscribe((params) => {
        if (params.has('membershipRedirect')) {
          this.starCardTitleText = $localize`:@@MEMBERSHIPS__THIS_MEMBERSHIP_IS_NO_LONGER_AVAILABLE:This membership is no longer available`;
        } else {
          this.starCardTitleText = $localize`:@@MEMBERSHIPS__UNLEASH_THE_FULL_MINDS_EXPERIENCE:Unleash the full ${this.configs.get(
            'site_name'
          )} experience`;
        }
      })
    );

    this.starCardDescriptionText$ = this.route.queryParamMap.pipe(
      switchMap((params) => {
        const membershipRedirect = params.get('membershipRedirect');

        if (membershipRedirect) {
          this.showPageTitle$.next(false);
          const siteName = this.configs.get('site_name');
          return of(
            $localize`:@@MEMBERSHIPS__OTHER_AVAILABLE_MEMBERSHIPS:Check out these other available memberships from ${siteName}.`
          );
        }

        return this.siteMembershipsService.siteMemberships$.pipe(
          map((memberships: SiteMembership[]): string => {
            if (!memberships?.length) return null;

            const lowestPriceMembership: SiteMembership =
              this.siteMembershipsService.getLowestPriceMembershipFromArray(
                memberships
              );
            if (!lowestPriceMembership) return null;

            const currencySymbol: string =
              getCurrencySymbol(
                lowestPriceMembership.priceCurrency,
                'narrow'
              ) ?? '$';
            return $localize`:@@MEMBERSHIPS__MEMBERSHIPS_START_AT_X_PER_MONTH:Memberships start at ${currencySymbol}${
              lowestPriceMembership.membershipPriceInCents / 100
            }`;
          })
        );
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
  }: SiteMembershipsPageModalData) {
    this.isModal = isModal;
    if (this.isModal) {
      this.showPageTitle$.next(false);
    }
    this.onDismissIntent = onDismissIntent ?? (() => {});
    this.onJoinClick = onJoinClick ?? (() => {});
  }
}
