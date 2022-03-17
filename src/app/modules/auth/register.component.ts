import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Navigation as NavigationService } from '../../services/navigation';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { SignupModalService } from '../modals/signup/service';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { ConfigsService } from '../../common/services/configs.service';
import { PagesService } from '../../common/services/pages.service';
import { FeaturesService } from '../../services/features.service';
import { MetaService } from '../../common/services/meta.service';
import { iOSVersion } from '../../helpers/is-safari';
import { TopbarService } from '../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { AuthRedirectService } from '../../common/services/auth-redirect.service';
import { OnboardingV3Service } from '../onboarding-v3/onboarding-v3.service';

@Component({
  selector: 'm-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.ng.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  readonly cdnAssetsUrl: string;
  readonly cdnUrl: string;
  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  videoError: boolean = false;
  referrer: string;

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
    public navigation: NavigationService,
    private navigationService: SidebarNavigationService,
    private configs: ConfigsService,
    private featuresService: FeaturesService,
    private topbarService: TopbarService,
    private metaService: MetaService,
    private pageLayoutService: PageLayoutService,
    private authRedirectService: AuthRedirectService,
    private onboardingV3: OnboardingV3Service
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.cdnUrl = configs.get('cdn_url');
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }
  }

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.loginReferrer.register('/newsfeed');
      this.loginReferrer.navigate();
    }

    this.topbarService.toggleVisibility(false);
    this.iosFallback = iOSVersion() !== null;

    this.navigationService.setVisible(false);
    this.pageLayoutService.useFullWidth();

    this.redirectTo = localStorage.getItem('redirect');

    // Set referrer if there is one
    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      if (params['referrer']) {
        this.referrer = params['referrer'];
        this.setReferrerMetaImage();
      } else {
        this.setPlaceholderMetaImage();
      }
      if (params['redirectUrl']) {
        this.redirectTo = decodeURI(params['redirectUrl']);
      }
    });

    this.metaService.setTitle('Register');

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }
  }

  async setReferrerMetaImage(): Promise<void> {
    try {
      const response: any = await this.client.get(
        `api/v1/channel/${this.referrer}`
      );
      if (response && response.channel) {
        const ch = response.channel;
        ch.icontime = ch.icontime ? ch.icontime : '';

        this.metaService.setOgImage(
          `${this.cdnUrl}icon/${ch.guid}/large/${ch.icontime}`
        );
      } else {
        this.setPlaceholderMetaImage();
      }
    } catch (e) {
      console.error(e);
    }
  }

  setPlaceholderMetaImage(): void {
    this.metaService.setOgImage('/assets/og-images/default-v3.png');
  }

  registered() {
    if (this.redirectTo) {
      this.navigateToRedirection();
    } else {
      /**
       * If a redirect hasn't already been defined,
       * use the experiment to determine where to go
       */
      this.router.navigate([this.authRedirectService.getRedirectUrl()]);
    }

    this.onboardingV3.open();
  }

  onSourceError() {
    this.videoError = true;
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    this.topbarService.toggleVisibility(true);

    this.navigationService.setVisible(true);
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

    // If this is an api redirect, we need to redirect outside of angular router
    if (uri[0].indexOf(this.configs.get('site_url') + 'api/') === 0) {
      window.location.href = this.redirectTo;
    } else {
      this.router.navigate([uri[0]], extras);
    }
  }
}
