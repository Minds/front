import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { SignupModalService } from '../modals/signup/service';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { OnboardingService } from '../onboarding/onboarding.service';
import { CookieService } from '../../common/services/cookie.service';
import { FeaturesService } from '../../services/features.service';
import { iOSVersion } from '../../helpers/is-safari';
import { TopbarService } from '../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';

@Component({
  selector: 'm-login',
  templateUrl: 'login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  referrer: string;
  private redirectTo: string;

  @HostBinding('class.m-login--newDesign')
  newDesign: boolean = false;

  @HostBinding('class.m-login--newNavigation')
  newNavigation: boolean = false;

  @HostBinding('class.m-login__iosFallback')
  iosFallback: boolean = false;

  flags = {
    canPlayInlineVideos: true,
  };

  paramsSubscription: Subscription;

  constructor(
    public session: Session,
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    private modal: SignupModalService,
    private loginReferrer: LoginReferrerService,
    private cookieService: CookieService,
    private onboarding: OnboardingService,
    private featuresService: FeaturesService,
    private topbarService: TopbarService,
    private navigationService: SidebarNavigationService
  ) {}

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.loginReferrer.register('/newsfeed');
      this.loginReferrer.navigate();
    }

    this.redirectTo = this.cookieService.get('redirect');

    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      if (params['referrer']) {
        this.referrer = params['referrer'];
      }
    });

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
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

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.topbarService.toggleVisibility(true);

    if (this.featuresService.has('navigation')) {
      this.navigationService.setVisible(true);
    }
  }

  loggedin() {
    if (this.referrer) {
      this.router.navigateByUrl(this.referrer);
    } else if (this.redirectTo) {
      this.navigateToRedirection();
    } else {
      this.loginReferrer.navigate();
    }
  }

  registered() {
    if (this.redirectTo) {
      this.navigateToRedirection();
    } else {
      this.loginReferrer.navigate({
        defaultUrl: '/' + this.session.getLoggedInUser().username,
      });
    }
  }

  navigateToRedirection() {
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
