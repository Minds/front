import {
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { CookieService } from '../../common/services/cookie.service';
import { iOSVersion } from '../../helpers/is-safari';
import { TopbarService } from '../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { ConfigsService } from '../../common/services/configs.service';
import { AuthModalService } from './modal/auth-modal.service';
import { AuthRedirectService } from '../../common/services/auth-redirect.service';
import { OnboardingV5Service } from '../onboarding-v5/services/onboarding-v5.service';
import { WINDOW } from '../../common/injection-tokens/common-injection-tokens';
import { isPlatformBrowser } from '@angular/common';
import { IS_TENANT_NETWORK } from '../../common/injection-tokens/tenant-injection-tokens';

/**
 * Standalone login page
 */
@Component({
  selector: 'm-login',
  templateUrl: 'login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  twofactorToken: string = '';
  inProgress: boolean = false;
  referrer: string;
  private redirectTo: string;

  /**
   * Hides the default login form
   * e.g. when using oidc provider
   */
  hideLogin: boolean = false;

  @HostBinding('class.m-login__iosFallback')
  iosFallback: boolean = false;

  flags = {
    canPlayInlineVideos: true,
  };

  paramsSubscription: Subscription;

  subscriptions: Subscription[] = [];

  constructor(
    public session: Session,
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    private config: ConfigsService,
    private loginReferrer: LoginReferrerService,
    private cookieService: CookieService,
    private topbarService: TopbarService,
    private navigationService: SidebarNavigationService,
    private pageLayoutService: PageLayoutService,
    private authModal: AuthModalService,
    private authRedirectService: AuthRedirectService,
    private onboardingV5Service: OnboardingV5Service,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) protected platformId: Object,
    @Inject(IS_TENANT_NETWORK) protected readonly isTenantNetwork: boolean
  ) {}

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.loginReferrer.register('/newsfeed/subscriptions');
      this.loginReferrer.navigate();
    }

    this.subscriptions.push(
      this.authModal.onLoggedIn$.subscribe((loggedIn) => {
        if (loggedIn) {
          this.loggedin();
        }
      }),
      this.onboardingV5Service.onboardingCompleted$.subscribe((registered) => {
        if (registered) {
          this.registered();
        }
      })
    );

    if (isPlatformBrowser(this.platformId)) {
      this.authModal.open({ formDisplay: 'login', standalonePage: true });
    }

    this.redirectTo = this.cookieService.get('redirect');

    this.paramsSubscription = this.route.queryParams.subscribe((params) => {
      if (params['referrer']) {
        this.referrer = params['referrer'];
      }
      if (params['redirectUrl']) {
        this.redirectTo = decodeURI(params['redirectUrl']);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      if (/iP(hone|od)/.test(window.navigator.userAgent)) {
        this.flags.canPlayInlineVideos = false;
      }
    }

    this.topbarService.toggleVisibility(false);
    this.iosFallback = iOSVersion() !== null;

    this.navigationService.setVisible(false);
    this.pageLayoutService.useFullWidth();
  }

  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
    for (let subscription of this.subscriptions) {
      subscription?.unsubscribe();
    }
    this.topbarService.toggleVisibility(true);

    this.navigationService.setVisible(true);
    this.pageLayoutService.cancelFullWidth();
  }

  loggedin() {
    if (this.referrer) {
      this.router.navigateByUrl(this.referrer);
    } else if (this.redirectTo) {
      this.navigateToRedirection();
    } else if (!this.isTenantNetwork || this.loginReferrer.hasRegisteredUrl()) {
      this.loginReferrer.navigate();
    } else {
      this.authRedirectService.redirect();
    }
  }

  registered() {
    if (this.redirectTo) {
      this.navigateToRedirection();
    } else {
      this.authRedirectService.redirect();
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
      if (isPlatformBrowser(this.platformId)) {
        this.window.location.href = this.redirectTo;
      }
    } else {
      this.router.navigate([uri[0]], extras);
    }
  }
}
