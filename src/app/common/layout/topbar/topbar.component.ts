import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { NotificationsToasterComponent } from '../../../modules/notifications/toaster.component';
import { Session } from '../../../services/session';
import { ThemeService } from '../../services/theme.service';
import { ConfigsService } from '../../services/configs.service';
import { isPlatformBrowser } from '@angular/common';
import { SidebarNavigationService } from '../sidebar/navigation.service';
import { TopbarService } from '../topbar.service';
import { NavigationEnd, Router } from '@angular/router';
import { PageLayoutService } from '../page-layout.service';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { Observable, map, of, BehaviorSubject } from 'rxjs';
import { AuthRedirectService } from '../../services/auth-redirect.service';
import { TopbarAlertService } from '../../components/topbar-alert/topbar-alert.service';
import { IS_TENANT_NETWORK } from '../../injection-tokens/tenant-injection-tokens';
import { MultiTenantConfigImageService } from '../../../modules/multi-tenant-network/services/config-image.service';

/**
 * The topbar of the site, visible almost everywhere
 *
 * (but not on the homepage)
 */
@Component({
  selector: 'm-topbar',
  templateUrl: 'topbar.component.html',
})
export class TopbarComponent implements OnInit, OnDestroy {
  readonly cdnAssetsUrl: string;
  timeout;
  isTouchScreen = false;

  @ViewChild(DynamicHostDirective, { static: true })
  notificationsToasterHost: DynamicHostDirective;

  componentRef;
  componentInstance: NotificationsToasterComponent;

  showTopbar: boolean = true;
  marketingPages: boolean = false;
  showSearchBar: boolean = true;

  isMobile: boolean = false;

  onAuthPages: boolean = false; // sets to true if we're on login or register pages

  router$;

  /** Whether topbar alert should be shown. */
  protected readonly shouldShowTopbarAlert$: Observable<boolean> =
    this.topbarAlertService.shouldShow$;

  /** Whether topbar is to be displayed in FORCED minimal light mode. */
  public readonly isMinimalLightMode$: BehaviorSubject<boolean> =
    this.topbarService.isMinimalLightMode$;

  /** Whether topbar is to be displayed in minimal mode (dynamic based on light or dark theme). */
  public readonly isMinimalMode$: BehaviorSubject<boolean> =
    this.topbarService.isMinimalMode$;

  /** Whether CMS driven alert should be shown. */
  protected shouldShowCmsAlert$: Observable<boolean> =
    this.topbarAlertService.shouldShowCmsAlert$;

  /** Whether tenant trial alert should be shown. */
  protected readonly shouldShowTenantTrialAlert$: Observable<boolean> =
    this.topbarAlertService.shouldShowTenantTrialAlert$;

  /** Whether this is in a browser context. */
  protected readonly isBrowser: boolean = false;

  constructor(
    protected sidebarService: SidebarNavigationService,
    protected themeService: ThemeService,
    protected configs: ConfigsService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    protected topbarService: TopbarService,
    protected router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    public pageLayoutService: PageLayoutService,
    private authModal: AuthModalService,
    private authRedirectService: AuthRedirectService,
    private topbarAlertService: TopbarAlertService,
    private tenantConfigImageService: MultiTenantConfigImageService,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean
  ) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');

    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
      this.onResize();
    }
  }

  ngOnInit() {
    this.topbarService.setContainer(this);
    this.session.isLoggedIn(() => this.detectChanges());
    this.listen();
  }

  getCurrentUser() {
    return this.session.getLoggedInUser();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * Toggles sidebar navigation open.
   * @param { void }
   */
  public toggleSidebarNav(): void {
    this.sidebarService.isOpened$.next(true);
  }

  private listen() {
    this.setPages(this.router.url);

    this.router$ = this.router.events.subscribe(
      (navigationEvent: NavigationEnd) => {
        if (navigationEvent instanceof NavigationEnd) {
          if (!navigationEvent.urlAfterRedirects) {
            return;
          }

          this.setPages(
            navigationEvent.urlAfterRedirects || navigationEvent.url
          );
        }
      }
    );
  }

  private setPages(url) {
    this.onAuthPages = url === '/login' || url === '/register';
    this.detectChanges();
  }

  shouldShowLogo(): boolean {
    if (this.marketingPages) {
      return true;
    } else {
      return !this.isMobile;
    }
  }

  toggleVisibility(visible: boolean) {
    this.showTopbar = visible;
    this.detectChanges();
  }

  toggleMarketingPages(visible: boolean) {
    this.marketingPages = visible;
    this.detectChanges();
  }

  toggleSearchBar(visible: boolean) {
    this.showSearchBar = visible;
    this.detectChanges();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 540;
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.router$) {
      this.router$.unsubscribe();
    }
  }

  async onJoinNowClick() {
    const user = await this.authModal.open();
    if (user) this.doRedirect();
  }

  /**
   * Depending on enabled feature, either navigates to login
   * or opens auth modal login panel.
   * @returns { Promise<void> } - awaitable.
   */
  async onLoginClick(): Promise<void> {
    const user = await this.authModal.open({ formDisplay: 'login' });
    if (user) this.doRedirect();
  }

  doRedirect(): void {
    if (this.router.url === '/' || this.router.url === '/about') {
      this.authRedirectService.redirect();
    }
  }

  /**
   * Gets URL for main logo.
   * @returns { string } url for main logo.
   */
  public getMainLogoUrl(): string {
    return this.session.getLoggedInUser() ? '/newsfeed/subscriptions' : '/';
  }

  /**
   * Gets full width logo src depending on whether we're on a multi-tenant network.
   * @returns { Observable<string> } - observable of logo src.
   */
  public getFullLogoSrc$(mode: 'light' | 'dark'): Observable<string> {
    if (!this.isTenantNetwork) {
      return of(
        `${this.cdnAssetsUrl}assets/logos/` +
          (mode === 'light' ? 'logo-light-mode.svg' : 'logo-dark-mode.svg')
      );
    }
    return this.tenantConfigImageService.horizontalLogoPath$;
  }

  /**
   * Gets small logo src depending on whether we're on a multi-tenant network.
   * @returns { Observable<string> } - observable of logo src.
   */
  public getSmallLogoSrc$(): Observable<string> {
    if (!this.isTenantNetwork) {
      return of('assets/logos/bulb.svg');
    }
    return this.tenantConfigImageService.squareLogoPath$;
  }

  /**
   * Gets full width minimal mode logo src depending on whether we're on a multi-tenant network.
   * @returns { Observable<string> } - observable of logo src.
   */
  public getFullMinimalModeLogoSrc$(
    mode: 'light' | 'dark'
  ): Observable<string> {
    if (!this.isTenantNetwork) {
      return of('assets/logos/logo-monotone-light.png');
    }
    return this.tenantConfigImageService.horizontalLogoPath$;
  }

  /**
   * Gets small minimal mode logo src depending on whether we're on a multi-tenant network.
   * @returns { Observable<string> } - observable of logo src.
   */
  public getSmallMinimalModeLogoSrc$(): Observable<string> {
    if (!this.isTenantNetwork) {
      return of('assets/logos/logo-monotone-light-small.png');
    }
    return this.tenantConfigImageService.squareLogoPath$;
  }

  /**
   * True if current theme is dark.
   * @returns { Observable<boolean> } - true if theme is dark, else false.
   */
  get isDarkTheme$(): Observable<boolean> {
    return this.themeService.isDark$;
  }
}
