import { isPlatformBrowser } from '@angular/common';
import { ServiceWorkerService } from './common/services/service-worker.service';
import { ScrollRestorationService } from './services/scroll-restoration.service';
import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

import { NotificationService } from './modules/notifications/notification.service';
import { AnalyticsService } from './services/analytics';
import { SocketsService } from './services/sockets';
import { Session } from './services/session';
import { LoginReferrerService } from './services/login-referrer.service';
import { ScrollToTopService } from './services/scroll-to-top.service';
import { ContextService } from './services/context.service';
import { Web3WalletService } from './modules/blockchain/web3-wallet.service';
import { Client } from './services/api/client';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { BlockListService } from './common/services/block-list.service';
import { ThemeService } from './common/services/theme.service';
import { BannedService } from './modules/report/banned/banned.service';
import { DiagnosticsService } from './common/services/diagnostics/diagnostics.service';
import { SsoService } from './common/services/sso.service';
import { Subscription } from 'rxjs';
import { RouterHistoryService } from './common/services/router-history.service';
import { ConfigsService } from './common/services/configs.service';
import { MetaService } from './common/services/meta.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Upload } from './services/api/upload';
import { EmailConfirmationService } from './common/components/email-confirmation/email-confirmation.service';
import { ExperimentsService } from './modules/experiments/experiments.service';
import { MultiFactorAuthConfirmationService } from './modules/auth/multi-factor-auth/services/multi-factor-auth-confirmation.service';
import { CompassHookService } from './common/services/compass-hook.service';
import { OnboardingV4Service } from './modules/onboarding-v4/onboarding-v4.service';
import { OnboardingV5ModalLazyService } from './modules/onboarding-v5/services/onboarding-v5-modal-lazy.service';
import { OnboardingV5Service } from './modules/onboarding-v5/services/onboarding-v5.service';
import { ExplainerScreensService } from './modules/explainer-screens/services/explainer-screen.service';
import { ChatInitService } from './modules/chat/services/chat-init.service';
import { HeadElementInjectorService } from './common/services/head-element-injector.service';

@Component({
  selector: 'm-app',
  templateUrl: 'app.component.html',
})
export class Minds implements OnInit, OnDestroy {
  name: string;

  ready: boolean = false;

  showTOSModal: boolean = false;

  protected router$: Subscription;

  protected clientError$: Subscription;
  protected uploadError$: Subscription;

  protected routerConfig: Route[];

  private multiFactorSuccessSubscription: Subscription;
  private emailConfirmationLoginSubscription: Subscription;

  constructor(
    public session: Session,
    public route: ActivatedRoute,
    public notificationService: NotificationService,
    public scrollToTop: ScrollToTopService,
    public scrollRestoration: ScrollRestorationService,
    public analytics: AnalyticsService,
    public sockets: SocketsService,
    public loginReferrer: LoginReferrerService,
    public context: ContextService,
    public web3Wallet: Web3WalletService,
    public client: Client,
    public upload: Upload,
    private emailConfirmationService: EmailConfirmationService,
    public router: Router,
    public themeService: ThemeService,
    private bannedService: BannedService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private diagnostics: DiagnosticsService,
    private routerHistoryService: RouterHistoryService,
    private sso: SsoService,
    private metaService: MetaService,
    private configs: ConfigsService,
    private cd: ChangeDetectorRef,
    private socketsService: SocketsService,
    private experimentsService: ExperimentsService,
    private multiFactorConfirmation: MultiFactorAuthConfirmationService,
    private compassHook: CompassHookService,
    private serviceWorkerService: ServiceWorkerService,
    private onboardingV4Service: OnboardingV4Service, // force init.
    private onboardingV5Service: OnboardingV5Service,
    private onboardingV5ModalService: OnboardingV5ModalLazyService,
    private explainerScreenService: ExplainerScreensService,
    private chatInitService: ChatInitService,
    private headElementInjectorService: HeadElementInjectorService
  ) {
    this.name = 'Minds';
  }

  async ngOnInit() {
    // Start the router
    this.router.initialNavigation();

    this.clientError$ = this.client.onError.subscribe(
      this.checkXHRError.bind(this)
    );

    this.uploadError$ = this.upload.onError.subscribe(
      this.checkXHRError.bind(this)
    );

    // MH: does loading meta tags before the configs have been set cause issues?
    this.router$ = this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.route),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        // filter(route => route.outlet === 'primary')
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        this.metaService.reset(data);
        // check route to see if we need to show an explainer screen.
        this.explainerScreenService.handleRouteChange(
          this.router.url.split('?')[0]
        );
      });

    try {
      this.updateMeta(); // Because the router is setup before our configs

      // Setup sentry/diagnostic configs
      this.diagnostics.setUser(this.configs.get('user'));
      this.diagnostics.listen(); // Listen for user changes

      if (this.session.getLoggedInUser()) {
        if (await this.shouldShowOnboardingV5()) {
          this.onboardingV5ModalService.open();
        } else {
          // We do not need to this to be shown if OnboardingV5 has been shown.
          // We should be able to remove when OnboardingV5 is fully released.
          this.checkEmailConfirmation();
        }
      }

      if (isPlatformBrowser(this.platformId)) {
        this.serviceWorkerService.watchForUpdates();
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

    this.multiFactorSuccessSubscription = this.multiFactorConfirmation.success$
      .pipe(filter((success) => success))
      .subscribe((success) => {
        this.multiFactorConfirmation.reset();

        if (this.router.url === '/' || this.router.url === '/about') {
          this.router.navigate(['/newsfeed/subscriptions']);
        }
      });
  }

  checkXHRError(err: string | any) {
    if (err.status === 403 && err.error.must_verify) {
      this.emailConfirmationService.showError();
    }
  }

  async initialize() {
    this.notificationService.listen();
    this.notificationService.updateNotificationCount();

    this.session.isLoggedIn(async (is) => {
      if (is) {
        const user = this.session.getLoggedInUser();
        const language = this.configs.get('language');

        if (user.language !== language) {
          console.log('[app]:: language change', user.language, language);
          window.location.href = window.location.href;
        }

        if (await this.shouldShowOnboardingV5()) {
          this.onboardingV5ModalService.open();
        } else {
          // We do not need to this to be shown if OnboardingV5 has been shown.
          // We should be able to remove when OnboardingV5 is fully released.
          this.checkEmailConfirmation();
        }

        this.notificationService.listen();
        this.notificationService.updateNotificationCount();

        this.chatInitService.reinit();
      } else {
        this.notificationService.unlisten();

        this.chatInitService.destroy();
      }
    });

    this.loginReferrer
      .avoid([
        '/',
        '/login',
        '/logout',
        '/logout/all',
        '/register',
        '/forgot-password',
      ])
      .listen();

    this.scrollToTop.listen();

    this.scrollRestoration.listen();

    this.context.listen();

    this.web3Wallet.setUp();

    this.themeService.setUp();

    this.socketsService.setUp();

    if (this.session.isLoggedIn()) {
      this.chatInitService.init();
    }
    // TODO uncomment this when we want logged out users
    // to complete the social compass questionnaire
    // this.compassHook.listen();

    if (this.configs.get('tenant')?.['custom_script']) {
      this.headElementInjectorService.injectFromString(
        this.configs.get('tenant')['custom_script']
      );
    }
  }

  /**
   * Whether this is the main Minds domain (www.minds.com).
   * @returns { boolean } - true if we are on the main Minds domain.
   */
  public isMindsMainDomain(): boolean {
    return isPlatformBrowser(this.platformId)
      ? window.location.href.includes('www.minds.com')
      : false;
  }

  /**
   * Whether onboarding v5 should be shown.
   * @returns { Promise<boolean> } true if onboarding v5 should be shown.
   */
  private async shouldShowOnboardingV5(): Promise<boolean> {
    return !(await this.onboardingV5Service.hasCompletedOnboarding());
  }

  ngOnDestroy() {
    this.loginReferrer.unlisten();
    this.scrollToTop.unlisten();
    this.scrollRestoration.unlisten();
    this.router$.unsubscribe();
    this.clientError$.unsubscribe();
    this.uploadError$.unsubscribe();

    if (this.emailConfirmationLoginSubscription) {
      this.emailConfirmationLoginSubscription.unsubscribe();
    }
  }

  private updateMeta(): void {
    let route = this.route;
    while (route.firstChild) route = route.firstChild;
    this.metaService.reset(route.snapshot.data);
  }

  /**
   * Checks whether email confirmation if required. will then call
   * confirm function, which will cause MFA modal to trigger
   * via MultiFactorHttpInterceptorService.
   * @returns { void }
   */
  private checkEmailConfirmation(): void {
    if (this.emailConfirmationService.requiresEmailConfirmation()) {
      // try to verify - this should cause MFA modal to trigger from interceptor.
      this.emailConfirmationService.confirm();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
