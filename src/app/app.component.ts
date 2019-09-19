import { Component, HostBinding } from '@angular/core';

import { NotificationService } from './modules/notifications/notification.service';
import { AnalyticsService } from './services/analytics';
import { SocketsService } from './services/sockets';
import { Session } from './services/session';
import { LoginReferrerService } from './services/login-referrer.service';
import { ScrollToTopService } from './services/scroll-to-top.service';
import { ContextService } from './services/context.service';
import { Web3WalletService } from './modules/blockchain/web3-wallet.service';
import { Client } from './services/api/client';
import { WebtorrentService } from './modules/webtorrent/webtorrent.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChannelOnboardingService } from './modules/onboarding/channel/onboarding.service';
import { BlockListService } from './common/services/block-list.service';
import { FeaturesService } from './services/features.service';
import { ThemeService } from './common/services/theme.service';
import { BannedService } from './modules/report/banned/banned.service';
import { DiagnosticsService } from './services/diagnostics.service';
import { SiteService } from './services/site.service';
import { PRO_DOMAIN_ROUTES, proRoutes } from './modules/pro/pro.module';
import { Subscription } from 'rxjs';
import { RouterHistoryService } from './common/services/router-history.service';

@Component({
  moduleId: module.id,
  selector: 'm-app',
  templateUrl: 'app.component.html',
})
export class Minds {
  name: string;
  minds = window.Minds;

  showOnboarding: boolean = false;

  showTOSModal: boolean = false;

  paramsSubscription;

  protected router$: Subscription;

  constructor(
    public session: Session,
    public route: ActivatedRoute,
    public notificationService: NotificationService,
    public scrollToTop: ScrollToTopService,
    public analytics: AnalyticsService,
    public sockets: SocketsService,
    public loginReferrer: LoginReferrerService,
    public context: ContextService,
    public web3Wallet: Web3WalletService,
    public client: Client,
    public webtorrent: WebtorrentService,
    public onboardingService: ChannelOnboardingService,
    public router: Router,
    public blockListService: BlockListService,
    public featuresService: FeaturesService,
    public themeService: ThemeService,
    private bannedService: BannedService,
    private diagnostics: DiagnosticsService,
    private routerHistoryService: RouterHistoryService,
    private site: SiteService
  ) {
    this.name = 'Minds';

    if (this.site.isProDomain) {
      this.router.resetConfig(PRO_DOMAIN_ROUTES);
    }
  }

  async ngOnInit() {
    this.diagnostics.setUser(this.minds.user);
    this.diagnostics.listen(); // Listen for user changes

    if (this.site.isProDomain) {
      this.notificationService.getNotifications();

      this.router$ = this.router.events.subscribe(
        (navigationEvent: NavigationEnd) => {
          try {
            if (navigationEvent instanceof NavigationEnd) {
              if (!navigationEvent.urlAfterRedirects) {
                return;
              }

              let url = navigationEvent.url
                .substring(1, navigationEvent.url.length)
                .split('/')[0]
                .split(';')[0]
                .split('?')[0];

              if (!this.searchRoutes(url, proRoutes)) {
                window.open(window.Minds.site_url + url, '_blank');
              }
            }
          } catch (e) {
            console.error('Minds: router hook(SearchBar)', e);
          }
        }
      );
    }

    this.session.isLoggedIn(async is => {
      if (is && !this.site.isProDomain) {
        if (!this.site.isProDomain) {
          this.showOnboarding = await this.onboardingService.showModal();
        }

        if (this.minds.user.language !== this.minds.language) {
          console.log(
            '[app]:: language change',
            this.minds.user.language,
            this.minds.language
          );
          window.location.reload(true);
        }
      }
    });

    this.onboardingService.onClose.subscribe(() => {
      this.showOnboarding = false;
    });

    this.onboardingService.onOpen.subscribe(async () => {
      this.showOnboarding = await this.onboardingService.showModal(true);
    });

    this.loginReferrer
      .avoid([
        '/login',
        '/logout',
        '/logout/all',
        '/register',
        '/forgot-password',
      ])
      .listen();

    this.scrollToTop.listen();

    this.context.listen();

    this.web3Wallet.setUp();

    this.webtorrent.setUp();

    this.themeService.setUp();
  }

  private searchRoutes(url: string, routes: Array<string>): boolean {
    for (let route of routes) {
      if (route.includes(url)) {
        return true;
      }
    }

    return false;
  }

  ngOnDestroy() {
    this.loginReferrer.unlisten();
    this.scrollToTop.unlisten();
    this.paramsSubscription.unsubscribe();
  }

  @HostBinding('class') get cssColorSchemeOverride() {
    if (!this.site.isProDomain || !this.site.pro.scheme) {
      return '';
    }

    return `m-theme--wrapper m-theme--wrapper__${this.site.pro.scheme}`;
  }

  get isProDomain() {
    return this.site.isProDomain;
  }
}
