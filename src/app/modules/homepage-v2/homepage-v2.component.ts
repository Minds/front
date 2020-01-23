import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Client } from '../../services/api/client';
import { Router } from '@angular/router';
import { Navigation as NavigationService } from '../../services/navigation';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { Session } from '../../services/session';
import { V2TopbarService } from '../../common/layout/v2-topbar/v2-topbar.service';
import { RegisterForm } from '../forms/register/register';
import { FeaturesService } from '../../services/features.service';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'm-homepage__v2',
  templateUrl: 'homepage-v2.component.html',
})
export class HomepageV2Component {
  @ViewChild('registerForm', { static: false }) registerForm: RegisterForm;

  readonly cdnAssetsUrl: string;
  readonly siteUrl: string;

  constructor(
    public client: Client,
    public router: Router,
    public navigation: NavigationService,
    public session: Session,
    private loginReferrer: LoginReferrerService,
    private featuresService: FeaturesService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
  }

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }
  }

  navigate() {
    this.router.navigate(['/register']);
  }

  isMobile() {
    return window.innerWidth <= 540;
  }
}
