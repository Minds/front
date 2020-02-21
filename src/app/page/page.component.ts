import { Component, OnInit } from '@angular/core';
import { Session } from '../services/session';
import { FeaturesService } from '../services/features.service';
import { SiteService } from '../common/services/site.service';
import { SidebarNavigationService } from '../common/layout/sidebar/navigation.service';
import { ChannelOnboardingService } from '../modules/onboarding/channel/onboarding.service';

@Component({
  selector: 'm-page',
  templateUrl: 'page.component.html',
})
export class PageComponent implements OnInit {
  useNewNavigation: boolean = false;

  showOnboarding: boolean = false;

  isSidebarVisible: boolean = true;

  constructor(
    public session: Session,
    public featuresService: FeaturesService,
    private navigationService: SidebarNavigationService,
    private onboardingService: ChannelOnboardingService,
    private site: SiteService
  ) {}

  ngOnInit() {
    this.useNewNavigation = this.featuresService.has('navigation');

    this.navigationService.visibleChange.subscribe((visible: boolean) => {
      this.isSidebarVisible = visible;
    });

    this.session.isLoggedIn(async is => {
      if (is && !this.site.isProDomain) {
        if (!this.site.isProDomain) {
          this.showOnboarding = await this.onboardingService.showModal();
        }
      }
    });

    this.onboardingService.onClose.subscribe(() => {
      this.showOnboarding = false;
    });

    this.onboardingService.onOpen.subscribe(async () => {
      this.showOnboarding = await this.onboardingService.showModal(true);
    });
  }

  get isProDomain() {
    return this.site.isProDomain;
  }

  hasMarkersSidebar() {
    return (
      this.session.isLoggedIn() &&
      !this.isProDomain &&
      !this.featuresService.has('navigation')
    );
  }
}
