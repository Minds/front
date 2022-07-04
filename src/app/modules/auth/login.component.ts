import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { SignupModalService } from '../modals/signup/service';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { CookieService } from '../../common/services/cookie.service';
import { FeaturesService } from '../../services/features.service';
import { iOSVersion } from '../../helpers/is-safari';
import { TopbarService } from '../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { ConfigsService } from '../../common/services/configs.service';

/**
 * Standalone login page
 */
@Component({
  selector: 'm-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.ng.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  referrer: string;
  private redirectTo: string;

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
    private config: ConfigsService,
    private loginReferrer: LoginReferrerService,
    private cookieService: CookieService,
    private featuresService: FeaturesService,
    private topbarService: TopbarService,
    private navigationService: SidebarNavigationService,
    private pageLayoutService: PageLayoutService
  ) {}

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.loginReferrer.register('/newsfeed/subscriptions');
      this.loginReferrer.navigate();
    }

    this.redirectTo = this.cookieService.get('redirect');

    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      if (params['referrer']) {
        this.referrer = params['referrer'];
      }
      if (params['redirectUrl']) {
        this.redirectTo = decodeURI(params['redirectUrl']);
      }
    });

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }

    this.topbarService.toggleVisibility(false);
    this.iosFallback = iOSVersion() !== null;

    this.navigationService.setVisible(false);
    this.pageLayoutService.useFullWidth();
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.topbarService.toggleVisibility(true);

    this.navigationService.setVisible(true);
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

    // If this is an api redirect, we need to redirect outside of angular router
    if (uri[0].indexOf(this.config.get('site_url') + 'api/') === 0) {
      window.location.href = this.redirectTo;
    } else {
      this.router.navigate([uri[0]], extras);
    }
  }
}
