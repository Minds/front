import { Component, ViewChild } from '@angular/core';
import { Client } from '../../services/api/client';
import { MindsTitle } from '../../services/ux/title';
import { Router } from '@angular/router';
import { Navigation as NavigationService } from '../../services/navigation';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { Session } from '../../services/session';
import { RegisterForm } from '../forms/register/register';
import { FeaturesService } from '../../services/features.service';
import { OnboardingV2Service } from '../onboarding-v2/service/onboarding.service';

@Component({
  selector: 'm-homepage__v2',
  templateUrl: 'homepage-v2.component.html',
})
export class HomepageV2Component {
  @ViewChild('registerForm', { static: false }) registerForm: RegisterForm;

  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;
  readonly siteUrl: string = window.Minds.site_url;

  minds = window.Minds;

  constructor(
    public client: Client,
    public title: MindsTitle,
    public router: Router,
    public navigation: NavigationService,
    public session: Session,
    private loginReferrer: LoginReferrerService,
    private featuresService: FeaturesService,
    private onboardingService: OnboardingV2Service
  ) {
    this.title.setTitle('Minds Social Network', false);

    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }
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
