import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../common/services/configs.service';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import {
  NavigationItem,
  NavigationItemTypeEnum,
} from '../../../../graphql/generated.engine';
import { WINDOW } from '../../../common/injection-tokens/common-injection-tokens';
import { SITE_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { Session } from '../../../services/session';

const FALLBACK_LANDING_PAGE_PATH: string = '/newsfeed';

/**
 * Service for the handling of the redirect after tenant user login or registration.
 */
@Injectable({ providedIn: 'root' })
export class TenantLoggedInLandingRedirectService {
  constructor(
    private configs: ConfigsService,
    private router: Router,
    private session: Session,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean,
    @Inject(WINDOW) private readonly window: Window,
    @Inject(SITE_URL) private readonly siteUrl: string
  ) {}

  /**
   * Redirects the user to the chosen or fallback landing page.
   * @returns { void }
   */
  public redirect(): void {
    if (!this.isTenantNetwork) {
      this.router.navigateByUrl(FALLBACK_LANDING_PAGE_PATH);
      return;
    }

    const landingPage: NavigationItem | null =
      this.getLoggedInLandingPageItem();

    switch (landingPage?.type) {
      case NavigationItemTypeEnum.Core:
        if (landingPage?.id === 'channel') {
          this.router.navigateByUrl(
            '/' + this.session.getLoggedInUser()?.username ??
              FALLBACK_LANDING_PAGE_PATH
          );
        } else {
          this.router.navigateByUrl(
            landingPage?.path ?? FALLBACK_LANDING_PAGE_PATH
          );
        }
        break;
      case NavigationItemTypeEnum.CustomLink:
        this.handleCustomLinkRedirect(landingPage);
        break;
      default:
        this.router.navigateByUrl(FALLBACK_LANDING_PAGE_PATH);
    }
  }

  /**
   * Gets the logged in landing page item.
   * @returns { NavigationItem|null } The logged in landing page item.
   */
  private getLoggedInLandingPageItem(): NavigationItem | null {
    if (!this.isTenantNetwork) return null;
    const loggedInLandingPageId: string =
      this.configs.get('tenant')?.['logged_in_landing_page_id_web'];
    return this.getNavigationItem(loggedInLandingPageId);
  }

  /**
   * Gets the navigation item by id.
   * @param { string } id - The id of the navigation item.
   * @returns { NavigationItem|null } The navigation item.
   */
  private getNavigationItem(id: string): NavigationItem | null {
    if (!this.isTenantNetwork) return null;
    return (
      this.configs
        .get('custom')
        ?.[
          'navigation'
        ]?.find((item: NavigationItem): boolean => item['id'] === id) ?? null
    );
  }

  /**
   * Handles redirect to a custom link.
   * @param { NavigationItem } navigationItem - The navigation item to redirect to.
   * @returns { void }
   */
  private handleCustomLinkRedirect(navigationItem: NavigationItem): void {
    if (!navigationItem?.url) {
      this.router.navigateByUrl(FALLBACK_LANDING_PAGE_PATH);
    }

    if (navigationItem.url?.startsWith('/')) {
      this.router.navigateByUrl(navigationItem.url);
      return;
    }

    if (navigationItem.url?.startsWith(this.siteUrl)) {
      this.router.navigateByUrl(
        '/' + navigationItem.url.replace(this.siteUrl, '')
      );
      return;
    }

    this.window.open(navigationItem.url, '_self');
  }
}
