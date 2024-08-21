import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MultiTenantNavigationService } from '../../services/navigation.service';
import { BehaviorSubject, lastValueFrom, map, Subscription, take } from 'rxjs';
import {
  NavigationItem,
  NavigationItemTypeEnum,
} from '../../../../../../../../graphql/generated.engine';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { MultiTenantNetworkConfigService } from '../../../../../services/config.service';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { SITE_URL } from '../../../../../../../common/injection-tokens/url-injection-tokens';

/** Core navigation items that are selectable for web. */
const SELECTABLE_WEB_NAVIGATION_ITEMS: string[] = [
  'newsfeed',
  'explore',
  'groups',
  'chat',
  'channel',
  'notifications',
];

/** Core navigation items that are selectable for mobile. */
const SELECTABLE_MOBILE_NAVIGATION_ITEMS: string[] = [
  'newsfeed',
  'explore',
  'groups',
  'chat',
  'notifications',
];

/** Default landing page id for web. */
const WEB_DEFAULT_LANDING_PAGE_ID: string = 'newsfeed';

/** Default landing page id for mobile. */
const MOBILE_DEFAULT_LANDING_PAGE_ID: string = 'newsfeed';

@Component({
  selector: 'm-networkAdminConsoleNavigation__landingPageSelector',
  templateUrl: './landing-page-selector.component.html',
  styleUrls: [
    './landing-page-selector.component.ng.scss',
    '../../../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleLandingPageSelectorComponent
  implements OnInit, OnDestroy
{
  /** Selectable items for web. */
  protected readonly webLandingPageItems$ =
    this.multiTenantNavigationService.allNavigationItems$.pipe(
      map((items) =>
        items.filter(
          (item: NavigationItem): boolean =>
            SELECTABLE_WEB_NAVIGATION_ITEMS.includes(item.id) ||
            this.isInternalCustomNavigationItem(item)
        )
      )
    );

  /** Selectable items for mobile. */
  protected readonly mobileLandingPageItems$ =
    this.multiTenantNavigationService.allNavigationItems$.pipe(
      map((items) =>
        items.filter((item) =>
          SELECTABLE_MOBILE_NAVIGATION_ITEMS.includes(item.id)
        )
      )
    );

  /** Currently set web landing page. */
  protected readonly currentWebLandingPageItem$: BehaviorSubject<NavigationItem> =
    new BehaviorSubject<NavigationItem>(null);

  /** Currently set mobile landing page. */
  protected readonly currentMobileLandingPageItem$: BehaviorSubject<NavigationItem> =
    new BehaviorSubject<NavigationItem>(null);

  /** Subscription for the retrieval of navigation items. */
  private allNavigationItemSubscription: Subscription;

  constructor(
    private multiTenantNavigationService: MultiTenantNavigationService,
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private configs: ConfigsService,
    private toaster: ToasterService,
    @Inject(SITE_URL) private siteUrl: string
  ) {}

  ngOnInit(): void {
    const webLoggedInLandingPageId: string =
      this.configs.get('tenant')?.['logged_in_landing_page_id_web'] ??
      WEB_DEFAULT_LANDING_PAGE_ID;
    const mobileLoggedInLandingPageId: string =
      this.configs.get('tenant')?.['logged_in_landing_page_id_mobile'] ??
      MOBILE_DEFAULT_LANDING_PAGE_ID;

    this.allNavigationItemSubscription =
      this.multiTenantNavigationService.allNavigationItems$
        .pipe(take(1))
        .subscribe((items: NavigationItem[]): void => {
          this.currentWebLandingPageItem$.next(
            items.find((item) => item.id === webLoggedInLandingPageId)
          );
          this.currentMobileLandingPageItem$.next(
            items.find((item) => item.id === mobileLoggedInLandingPageId)
          );
        });
  }

  ngOnDestroy(): void {
    this.allNavigationItemSubscription?.unsubscribe();
  }

  /**
   * Handle web landing page change.
   * @param { NavigationItem } item - The new landing page item.
   * @returns { Promise<void> }
   */
  protected async onWebLandingPageChange(item: NavigationItem): Promise<void> {
    const originalWebLandingPageItem: NavigationItem =
      this.currentWebLandingPageItem$.getValue();

    if (item === originalWebLandingPageItem) {
      return;
    }

    this.currentWebLandingPageItem$.next(item);

    const success: boolean = await lastValueFrom(
      this.multiTenantConfigService.updateConfig({
        loggedInLandingPageIdWeb: item.id,
      })
    );

    if (success) {
      this.configs.set('tenant', {
        ...this.configs.get('tenant'),
        logged_in_landing_page_id_web: item.id,
      });
      this.toaster.success('Successfully updated landing page');
    } else {
      this.toaster.error('Failed to update landing page');
      this.currentWebLandingPageItem$.next(originalWebLandingPageItem);
    }
  }

  /**
   * Handle mobile landing page change.
   * @param { NavigationItem } item - The new landing page item.
   * @returns { Promise<void> }
   */
  protected async onMobileLandingPageChange(
    item: NavigationItem
  ): Promise<void> {
    const originalMobileLandingPageItem: NavigationItem =
      this.currentMobileLandingPageItem$.getValue();

    if (item === originalMobileLandingPageItem) {
      return;
    }

    this.currentMobileLandingPageItem$.next(item);

    const success: boolean = await lastValueFrom(
      this.multiTenantConfigService.updateConfig({
        loggedInLandingPageIdMobile: item.id,
      })
    );

    if (success) {
      this.configs.set('tenant', {
        ...this.configs.get('tenant'),
        logged_in_landing_page_id_mobile: item.id,
      });
      this.toaster.success('Successfully updated landing page');
    } else {
      this.currentMobileLandingPageItem$.next(originalMobileLandingPageItem);
      this.toaster.error('Failed to update landing page');
    }
  }

  /**
   * Determines if a navigation item is an internal custom link.
   * @param { NavigationItem } item - The navigation item to check.
   * @returns { boolean } Whether the item is an internal custom link.
   */
  private isInternalCustomNavigationItem(item: NavigationItem): boolean {
    return (
      item.type === NavigationItemTypeEnum.CustomLink &&
      (item.url?.startsWith('/') || item.url?.startsWith(this.siteUrl))
    );
  }
}
