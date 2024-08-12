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
import { Navigation as NavigationService } from '../../services/navigation';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { ConfigsService } from '../../common/services/configs.service';
import { PagesService } from '../../common/services/pages.service';
import { MetaService } from '../../common/services/meta.service';
import { iOSVersion } from '../../helpers/is-safari';
import { TopbarService } from '../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { AuthRedirectService } from '../../common/services/auth-redirect.service';
import { AuthModalService } from './modal/auth-modal.service';
import { IsTenantService } from '../../common/services/is-tenant.service';
import { SiteService } from '../../common/services/site.service';
import { HORIZONTAL_LOGO_PATH as TENANT_HORIZONTAL_LOGO } from '../multi-tenant-network/services/config-image.service';
import { OnboardingV5Service } from '../onboarding-v5/services/onboarding-v5.service';
import { WINDOW } from '../../common/injection-tokens/common-injection-tokens';
import { isPlatformBrowser } from '@angular/common';
import { IS_TENANT_NETWORK } from '../../common/injection-tokens/tenant-injection-tokens';

/**
 * Standalone register page for new users to sign up
 */
@Component({
  selector: 'm-register',
  templateUrl: 'register.component.html',
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

  /**
   * jwt token for users registering via an invite link
   */
  inviteToken: string;

  @HostBinding('class.m-register__iosFallback')
  iosFallback: boolean = false;

  private redirectTo: string;

  flags = {
    canPlayInlineVideos: true,
  };

  paramsSubscription: Subscription;

  subscriptions: Subscription[] = [];

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    public pagesService: PagesService,
    private loginReferrer: LoginReferrerService,
    public session: Session,
    public navigation: NavigationService,
    private navigationService: SidebarNavigationService,
    private configs: ConfigsService,
    private topbarService: TopbarService,
    private metaService: MetaService,
    private pageLayoutService: PageLayoutService,
    private authRedirectService: AuthRedirectService,
    private onboardingV5Service: OnboardingV5Service,
    private authModal: AuthModalService,
    private isTenant: IsTenantService,
    private site: SiteService,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(IS_TENANT_NETWORK) protected readonly isTenantNetwork: boolean
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

    this.inviteToken = this.route.snapshot.queryParams['invite_token'];

    if (isPlatformBrowser(this.platformId)) {
      this.authModal.open({
        formDisplay: 'register',
        standalonePage: true,
        inviteToken: this.inviteToken,
      });
    }

    this.topbarService.toggleVisibility(false);
    this.iosFallback = iOSVersion() !== null;

    this.navigationService.setVisible(false);
    this.pageLayoutService.useFullWidth();

    if (isPlatformBrowser(this.platformId)) {
      this.redirectTo = localStorage.getItem('redirect');
    }

    // Set referrer if there is one
    this.paramsSubscription = this.route.queryParams.subscribe((params) => {
      if (params['referrer']) {
        this.referrer = params['referrer'];
        this.setReferrerMetaImage();
      } else {
        this.setPlaceholderMetaImage();
      }
      if (params['redirectUrl']) {
        this.redirectTo = decodeURI(params['redirectUrl']);
      }
      if (params['invite_token']) {
        this.inviteToken = params['invite_token'];
      }
    });

    // set here rather than in auth module so we can set join to false.
    this.metaService
      .setTitle(
        this.isTenant.is()
          ? `Join us on ${this.site.title}`
          : 'Join Minds, and Elevate the Conversation',
        false
      )
      .setDescription(
        this.isTenant.is()
          ? `A social app.`
          : 'Minds is an open source social network dedicated to Internet freedom. Speak freely, protect your privacy, earn crypto rewards and take back control of your social media.'
      );

    if (isPlatformBrowser(this.platformId)) {
      if (/iP(hone|od)/.test(window.navigator.userAgent)) {
        this.flags.canPlayInlineVideos = false;
      }
    }
  }

  /**
   * If there's a referrer, make their avatar the meta ogImage
   */
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
        this.setReferrerTitle(ch.name);
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Sets title and og:title for referrer URLs.
   * @param { string } name - name of user to be interpolated into title. Defaults to 'us'.
   * @return { void }
   */
  setReferrerTitle(name: string = 'us'): void {
    this.metaService.setTitle(`Join ${name} on ${this.site.title}`, false);
  }

  setPlaceholderMetaImage(): void {
    if (this.isTenant.is()) {
      this.metaService.setOgImage(TENANT_HORIZONTAL_LOGO);
    } else {
      this.metaService.setOgImage('/assets/og-images/default-v3.png', {
        width: 1200,
        height: 1200,
      });
    }
  }

  /**
   * On user logged in.
   * @returns { void }
   */
  public loggedin(): void {
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

  onSourceError() {
    this.videoError = true;
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    this.topbarService.toggleVisibility(true);
    this.pageLayoutService.cancelFullWidth();
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
      if (isPlatformBrowser(this.platformId)) {
        this.window.location.href = this.redirectTo;
      }
    } else {
      this.router.navigate([uri[0]], extras);
    }
  }
}
