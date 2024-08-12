import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { AuthRedirectService } from '../../../../../common/services/auth-redirect.service';
import { SITE_NAME } from '../../../../../common/injection-tokens/common-injection-tokens';

/**
 * Boost/Advertise section for custom tenant homepage.
 */
@Component({
  selector: 'm-customTenantHomepage__advertise',
  templateUrl: 'advertise.component.html',
  styleUrls: ['advertise.component.ng.scss'],
})
export class TenantCustomHomepageAdvertiseComponent {
  /** Section title (localized). */
  protected readonly title: string;

  /** Section description (localized). */
  protected readonly description: string;

  constructor(
    private router: Router,
    private authRedirectService: AuthRedirectService,
    @Inject(SITE_NAME) protected readonly siteName: string
  ) {
    this.title = this.getTitle();
    this.description = this.getDescription();
  }

  /**
   * Start the boost creation flow.
   * @returns { Promise<void> }
   */
  public async startBoostCreationFlow(): Promise<void> {
    this.router.navigate(['/register'], {
      queryParams: {
        redirectUrl: encodeURI(
          this.authRedirectService.getDefaultRedirectUrl() + '?createBoost=1'
        ),
      },
    });
  }

  /**
   * Get the localized section title.
   * @returns { string } The localized title.
   */
  public getTitle(): string {
    return $localize`:@@CUSTOM_HOMEPAGE__BOOST_SECTION__TITLE:Advertise with ${this.siteName}:INTERPOLATION:`;
  }

  /**
   * Get the localized section description.
   * @returns { string } The localized description.
   */
  public getDescription(): string {
    return $localize`:@@CUSTOM_HOMEPAGE__BOOST_SECTION__DESCRIPTION:Reach a wider audience with ${this.getPluralSiteName()}:INTERPOLATION: social network and website. Increase your leads and visibility by serving ads seamlessly on our network.`;
  }

  /**
   * Get the pluralized site name.
   * @returns { string } The pluralized site name.
   */
  private getPluralSiteName(): string {
    if (this.siteName.endsWith('s')) {
      return `${this.siteName}'`;
    }
    return `${this.siteName}'s`;
  }
}
