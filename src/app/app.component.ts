import { ChangeDetectorRef, Component, HostBinding } from '@angular/core';

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
import { SiteService } from './common/services/site.service';
import { SsoService } from './common/services/sso.service';
import { Subscription } from 'rxjs';
import { RouterHistoryService } from './common/services/router-history.service';
import { PRO_DOMAIN_ROUTES } from './modules/pro/pro.module';

@Component({
  moduleId: module.id,
  selector: 'm-app',
  templateUrl: 'app.component.html',
})
export class Minds {
  name: string;

  minds = window.Minds;

  ready: boolean = false;

  showOnboarding: boolean = false;

  showTOSModal: boolean = false;

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
    private site: SiteService,
    private sso: SsoService,
    private cd: ChangeDetectorRef
  ) {
    this.name = 'Minds';

    if (this.site.isProDomain) {
      this.router.resetConfig(PRO_DOMAIN_ROUTES);
    }
  }

  async ngOnInit() {
    try {
      this.diagnostics.setUser(this.minds.user);
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

    if (!this.site.isProDomain) {
      this.notificationService.getNotifications();
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

  ngOnDestroy() {
    this.loginReferrer.unlisten();
    this.scrollToTop.unlisten();
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

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
