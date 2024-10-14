import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Session } from '../../../services/session';
import { SidebarNavigationService } from '../../../common/layout/sidebar/navigation.service';
import { ChannelOnboardingService } from '../../onboarding/channel/onboarding.service';
import { SiteService } from '../../../common/services/site.service';
import { PageLayoutService } from '../../../common/layout/page-layout.service';
import { Router } from '@angular/router';
import { Storage } from '../../../services/storage';
import { MessengerService } from '../../messenger/messenger.service';
import { isPlatformBrowser } from '@angular/common';
import isMobileOrTablet from '../../../helpers/is-mobile-or-tablet';
import { TopbarAlertService } from '../../../common/components/topbar-alert/topbar-alert.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'm-page',
  templateUrl: 'page.component.html',
  styleUrls: ['page.component.ng.scss'],
})
export class PageComponent implements OnInit {
  showOnboarding: boolean = false;

  isSidebarVisible: boolean = true;

  /** Whether sidebar v2 should be shown */
  public showSidebarV2: boolean = false;

  /** Whether topbar alert should be shown. */
  protected readonly shouldShowTopbarAlert$: Observable<boolean> =
    this.topbarAlertService.shouldShow$;

  constructor(
    public session: Session,
    private navigationService: SidebarNavigationService,
    private onboardingService: ChannelOnboardingService,
    private site: SiteService,
    public pageLayoutService: PageLayoutService,
    private router: Router,
    private storage: Storage,
    private messengerService: MessengerService,
    private topbarAlertService: TopbarAlertService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.isSidebarVisible = this.navigationService.container
      ? !this.navigationService.container.hidden
      : true;
    this.navigationService.visibleChange.subscribe((visible: boolean) => {
      setTimeout(() => {
        this.isSidebarVisible = visible;
      });
    });

    this.onboardingService.onClose.subscribe(() => {
      this.showOnboarding = false;
    });

    this.messengerService.setupLegacyMessengerVisibility();
  }

  hasMarkersSidebar() {
    return this.session.isLoggedIn() && false;
  }

  /**
   * Checks whether device is mobile or tablet
   * @returns { boolean }
   */
  public isMobileOrTablet(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return isMobileOrTablet();
  }
}
