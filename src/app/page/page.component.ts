import { Component, OnInit } from '@angular/core';
import { Session } from '../services/session';
import { FeaturesService } from '../services/features.service';
import { SiteService } from '../common/services/site.service';
import { ConfigsService } from '../common/services/configs.service';
import { ChannelOnboardingService } from '../modules/onboarding/channel/onboarding.service';

@Component({
  selector: 'm-page',
  templateUrl: 'page.component.html',
})
export class PageComponent implements OnInit {
  useNewNavigation: boolean = false;

  showOnboarding: boolean = false;

  constructor(
    public session: Session,
    public featuresService: FeaturesService,
    public onboardingService: ChannelOnboardingService,
    private site: SiteService,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    this.useNewNavigation = this.featuresService.has('navigation');
  }

  async initialize() {
    this.session.isLoggedIn(async is => {
      if (is && !this.site.isProDomain) {
        if (!this.site.isProDomain) {
          this.showOnboarding = await this.onboardingService.showModal();
        }

        const user = this.session.getLoggedInUser();
        const language = this.configs.get('language');

        if (user.language !== language) {
          console.log('[app]:: language change', user.language, language);
          window.location.reload(true);
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
