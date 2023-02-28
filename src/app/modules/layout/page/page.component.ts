import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Session } from '../../../services/session';
import { FeaturesService } from '../../../services/features.service';
import { SidebarNavigationService } from '../../../common/layout/sidebar/navigation.service';
import { ChannelOnboardingService } from '../../onboarding/channel/onboarding.service';
import { SiteService } from '../../../common/services/site.service';
import { PageLayoutService } from '../../../common/layout/page-layout.service';
import { Router } from '@angular/router';
import { Storage } from '../../../services/storage';
import { MessengerService } from '../../messenger/messenger.service';
import { isPlatformBrowser } from '@angular/common';
import isMobileOrTablet from '../../../helpers/is-mobile-or-tablet';
import { SidebarV2ExperimentService } from '../../experiments/sub-services/sidebar-v2-experiment.service';

@Component({
  selector: 'm-page',
  templateUrl: 'page.component.html',
  styleUrls: ['page.component.ng.scss'],
})
export class PageComponent implements OnInit {
  showOnboarding: boolean = false;

  isSidebarVisible: boolean = true;

  constructor(
    public session: Session,
    public featuresService: FeaturesService,
    private navigationService: SidebarNavigationService,
    private onboardingService: ChannelOnboardingService,
    private site: SiteService,
    public pageLayoutService: PageLayoutService,
    private router: Router,
    private storage: Storage,
    private messengerService: MessengerService,
    private sidebarV2Experiment: SidebarV2ExperimentService,
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

  get isProDomain() {
    return this.site.isProDomain;
  }

  hasMarkersSidebar() {
    return this.session.isLoggedIn() && !this.isProDomain && false;
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

  /**
   * Whether sidebar V2 experiment is active.
   * @returns { boolean }
   */
  public isSidebarV2ExperimentActive(): boolean {
    return this.sidebarV2Experiment.isActive();
  }
}
