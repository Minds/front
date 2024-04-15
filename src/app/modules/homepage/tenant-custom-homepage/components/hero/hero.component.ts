import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MultiTenantConfigImageService } from '../../../../multi-tenant-network/services/config-image.service';
import { Observable, Subscription } from 'rxjs';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { TopbarAlertService } from '../../../../../common/components/topbar-alert/topbar-alert.service';

/**
 * Hero component for custom tenant homepage.
 */
@Component({
  selector: 'm-customTenantHomepage__hero',
  templateUrl: 'hero.component.html',
  styleUrls: ['hero.component.ng.scss'],
})
export class TenantCustomHomepageHeroComponent implements OnInit, OnDestroy {
  /** Path of the logo to be shown. */
  protected readonly logoPath$: Observable<string> =
    this.multiTenantConfigImageService.squareLogoPath$;

  /** Name of the site. */
  protected readonly siteName: string;

  /** Custom description of homepage. */
  protected readonly customHomepageDescription: string;

  /** Whether the page has a topbar alert. */
  protected readonly topbarHasAlert$: Observable<boolean> =
    this.topbarAlertService.shouldShow$;

  /** Whether topbar alert is shown, bound to a class. */
  @HostBinding('class.m-customTenantHomepage__hero--topbarAlertShown')
  protected topbarAlertShown: boolean;

  /** Subscription to topbar alert. */
  private topbarAlertSubscription: Subscription;

  constructor(
    private multiTenantConfigImageService: MultiTenantConfigImageService,
    private topbarAlertService: TopbarAlertService,
    private config: ConfigsService
  ) {
    this.siteName = this.config.get('site_name');
    this.customHomepageDescription =
      this.config.get('tenant')?.['custom_home_page_description'];
  }

  ngOnInit(): void {
    this.topbarAlertSubscription =
      this.topbarAlertService.shouldShow$.subscribe(
        (isShown: boolean): void => {
          this.topbarAlertShown = isShown;
        }
      );
  }

  ngOnDestroy(): void {
    this.topbarAlertSubscription?.unsubscribe();
  }
}
