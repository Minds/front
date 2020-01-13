import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Client } from '../../services/api/client';
import { MindsTitle } from '../../services/ux/title';
import { Router } from '@angular/router';
import { Navigation as NavigationService } from '../../services/navigation';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { Session } from '../../services/session';
import { V2TopbarService } from '../../common/layout/v2-topbar/v2-topbar.service';
import { RegisterForm } from '../forms/register/register';
import { FeaturesService } from '../../services/features.service';

@Component({
  selector: 'm-homepage__v2',
  templateUrl: 'homepage-v2.component.html',
})
export class HomepageV2Component {
  @ViewChild('registerForm', { static: false }) registerForm: RegisterForm;

  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;

  minds = window.Minds;

  constructor(
    public client: Client,
    public title: MindsTitle,
    public router: Router,
    public navigation: NavigationService,
    public session: Session,
    private loginReferrer: LoginReferrerService,
    private featuresService: FeaturesService
  ) {
    this.title.setTitle('Minds Social Network', false);

    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }
  }

  navigate() {
    if (this.featuresService.has('onboarding-december-2019')) {
      this.router.navigate(['/onboarding']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  isMobile() {
    return window.innerWidth <= 540;
  }
}
