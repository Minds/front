import {
  ChangeDetectorRef,
  Component,
  PLATFORM_ID,
  Inject,
  HostBinding,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { NotificationService } from './modules/notifications/notification.service';
import { AnalyticsService } from './services/analytics';
import { SocketsService } from './services/sockets';
import { Session } from './services/session';
import { LoginReferrerService } from './services/login-referrer.service';
import { ScrollToTopService } from './services/scroll-to-top.service';
import { ContextService } from './services/context.service';
import { Web3WalletService } from './modules/blockchain/web3-wallet.service';
import { Client } from './services/api/client';
import { ActivatedRoute, NavigationEnd, Router, Route } from '@angular/router';
import { ChannelOnboardingService } from './modules/onboarding/channel/onboarding.service';
import { BlockListService } from './common/services/block-list.service';
import { FeaturesService } from './services/features.service';
import { ThemeService } from './common/services/theme.service';
import { BannedService } from './modules/report/banned/banned.service';
import { DiagnosticsService } from './services/diagnostics.service';
import { SiteService } from './common/services/site.service';
import { SsoService } from './common/services/sso.service';
import { Subscription } from 'rxjs';
import { RouterHistoryService } from './common/services/router-history.service';
import { PRO_DOMAIN_ROUTES } from './modules/pro/pro.module';
import { ConfigsService } from './common/services/configs.service';
import { MetaService } from './common/services/meta.service';
import { filter, map, mergeMap, first } from 'rxjs/operators';

@Component({
  selector: 'm-app',
  templateUrl: 'app.component.html',
})
export class Minds implements OnInit, OnDestroy {
  name: string;

  ready: boolean = false;

  showTOSModal: boolean = false;

  protected router$: Subscription;

  protected routerConfig: Route[];

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
    public router: Router,
    public blockListService: BlockListService,
    public featuresService: FeaturesService,
    public themeService: ThemeService,
    private bannedService: BannedService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private diagnostics: DiagnosticsService,
    private routerHistoryService: RouterHistoryService,
    private site: SiteService,
    private sso: SsoService,
    private metaService: MetaService,
    private configs: ConfigsService,
    private cd: ChangeDetectorRef,
    private socketsService: SocketsService
  ) {
    this.name = 'Minds';

    if (this.site.isProDomain) {
      this.router.resetConfig(PRO_DOMAIN_ROUTES);
    }
  }

  async ngOnInit() {
    // MH: does loading meta tags before the configs have been set cause issues?
    this.router$ = this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(() => this.route),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        // filter(route => route.outlet === 'primary')
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        this.metaService.reset(data);
      });

    try {
      this.updateMeta(); // Because the router is setup before our configs

      // Setup sentry/diagnostic configs
      this.diagnostics.setUser(this.configs.get('user'));
      this.diagnostics.listen(); // Listen for user changes

      if (this.sso.isRequired()) {
        await this.sso.connect();
      }
    } catch (e) {
      console.error('ngOnInit()', e);
    }

    this.ready = true;
    this.detectChanges();

    try {
      await this.initialize();
    } catch (e) {
      console.error('initialize()', e);
    }
  }

  async initialize() {
    this.blockListService.fetch();

    if (this.site.isProDomain) {
      this.site.listen();
    } else {
      this.notificationService.getNotifications();
    }

    this.session.isLoggedIn(async is => {
      if (is && !this.site.isProDomain) {
        const user = this.session.getLoggedInUser();
        const language = this.configs.get('language');

        if (user.language !== language) {
          console.log('[app]:: language change', user.language, language);
          window.location.reload(true);
        }
      }
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

    this.themeService.setUp();

    this.socketsService.setUp();
  }

  ngOnDestroy() {
    this.loginReferrer.unlisten();
    this.scrollToTop.unlisten();
    this.router$.unsubscribe();
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

  private updateMeta(): void {
    let route = this.route;
    while (route.firstChild) route = route.firstChild;
    this.metaService.reset(route.snapshot.data);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
