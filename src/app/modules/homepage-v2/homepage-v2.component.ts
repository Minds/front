import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../services/api/client';
import { Router } from '@angular/router';
import { Navigation as NavigationService } from '../../services/navigation';
import { Session } from '../../services/session';
import { RegisterForm } from '../forms/register/register';
import { FeaturesService } from '../../services/features.service';
import { ConfigsService } from '../../common/services/configs.service';
import { OnboardingV2Service } from '../onboarding-v2/service/onboarding.service';
import { MetaService } from '../../common/services/meta.service';
import { TopbarService } from '../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';

@Component({
  selector: 'm-homepage__v2',
  templateUrl: 'homepage-v2.component.html',
})
export class HomepageV2Component implements OnInit {
  @ViewChild('registerForm', { static: false }) registerForm: RegisterForm;

  readonly cdnAssetsUrl: string;
  readonly siteUrl: string;
  readonly headline = 'Take back control of your social media';
  readonly description =
    'A place to have open conversations and bring people together. Free your mind and get paid for creating content, driving traffic and referring friends.';

  constructor(
    public client: Client,
    public router: Router,
    public navigation: NavigationService,
    public session: Session,
    private featuresService: FeaturesService,
    configs: ConfigsService,
    private onboardingService: OnboardingV2Service,
    private metaService: MetaService,
    private navigationService: SidebarNavigationService,
    private topbarService: TopbarService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
  }

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }
    this.metaService
      .setTitle(`Minds - ${this.headline}`, false)
      .setDescription(this.description)
      .setCanonicalUrl('/')
      .setOgUrl('/');

    this.navigationService.setVisible(false);
    this.topbarService.toggleMarketingPages(true, false, false);
  }

  registered() {
    if (this.featuresService.has('onboarding-december-2019')) {
      if (this.onboardingService.shouldShow()) {
        this.router.navigate(['/onboarding']);
        return;
      }
    }

    this.router.navigate(['/' + this.session.getLoggedInUser().username]);
  }

  navigate() {
    this.router.navigate(['/register']);
  }

  isMobile() {
    return window.innerWidth <= 540;
  }
}
