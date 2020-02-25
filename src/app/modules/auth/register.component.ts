import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Navigation as NavigationService } from '../../services/navigation';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { SignupModalService } from '../modals/signup/service';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { OnboardingService } from '../onboarding/onboarding.service';
import { ConfigsService } from '../../common/services/configs.service';
import { PagesService } from '../../common/services/pages.service';
import { FeaturesService } from '../../services/features.service';
import { OnboardingV2Service } from '../onboarding-v2/service/onboarding.service';
import { MetaService } from '../../common/services/meta.service';
import { iOSVersion } from '../../helpers/is-safari';
import { TopbarService } from '../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';

@Component({
  selector: 'm-register',
  templateUrl: 'register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy {
  readonly cdnAssetsUrl: string;
  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  videoError: boolean = false;
  referrer: string;

  @HostBinding('class.m-register--newDesign')
  newDesign: boolean = false;

  @HostBinding('class.m-register--newNavigation')
  newNavigation: boolean = false;

  @HostBinding('class.m-register__iosFallback')
  iosFallback: boolean = false;

  private redirectTo: string;

  flags = {
    canPlayInlineVideos: true,
  };

  paramsSubscription: Subscription;

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    public pagesService: PagesService,
    private modal: SignupModalService,
    private loginReferrer: LoginReferrerService,
    public session: Session,
    private onboarding: OnboardingService,
    public navigation: NavigationService,
    private navigationService: SidebarNavigationService,
    configs: ConfigsService,
    private featuresService: FeaturesService,
    private topbarService: TopbarService,
    private onboardingService: OnboardingV2Service,
    private metaService: MetaService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }

    this.newDesign = this.featuresService.has('register_pages-december-2019');
    this.newNavigation = this.featuresService.has('navigation');

    if (this.newDesign) {
      this.topbarService.toggleVisibility(false);
      this.iosFallback = iOSVersion() !== null;

      if (this.featuresService.has('navigation')) {
        this.navigationService.setVisible(false);
      }
    }
  }

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.loginReferrer.register('/newsfeed');
      this.loginReferrer.navigate();
    }

    this.redirectTo = localStorage.getItem('redirect');

    // Set referrer if there is one
    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      if (params['referrer']) {
        this.referrer = params['referrer'];
      }
    });

    this.metaService.setTitle('Register');

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }
  }

  registered() {
    if (this.redirectTo) {
      this.navigateToRedirection();
      return;
    }

    if (this.featuresService.has('onboarding-december-2019')) {
      if (this.onboardingService.shouldShow()) {
        this.router.navigate(['/onboarding']);
        return;
      }
    }

    this.router.navigate(['/' + this.session.getLoggedInUser().username]);
  }

  onSourceError() {
    this.videoError = true;
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    this.topbarService.toggleVisibility(true);

    if (this.featuresService.has('navigation')) {
      this.navigationService.setVisible(true);
    }
  }

  private navigateToRedirection() {
    const uri = this.redirectTo.split('?', 2);
    const extras = {};

    if (uri[1]) {
      extras['queryParams'] = {};

      for (const queryParamString of uri[1].split('&')) {
        const queryParam = queryParamString.split('=');
        extras['queryParams'][queryParam[0]] = queryParam[1];
      }
    }

    this.router.navigate([uri[0]], extras);
  }
}
