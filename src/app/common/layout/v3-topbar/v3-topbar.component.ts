import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  HostBinding,
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
import { FeaturesService } from '../../../services/features.service';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { Observable } from 'rxjs';
import { AuthRedirectService } from '../../services/auth-redirect.service';
import { GuestModeExperimentService } from '../../../modules/experiments/sub-services/guest-mode-experiment.service';
import { ActivityV2ExperimentService } from '../../../modules/experiments/sub-services/activity-v2-experiment.service';

/**
 * The topbar of the site, visible almost everywhere
 *
 * (but not on the homepage)
 */
@Component({
  selector: 'm-v3topbar',
  templateUrl: 'v3-topbar.component.html',
})
export class V3TopbarComponent implements OnInit, OnDestroy {
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
  onHomepage: boolean = false; // sets to true if we're on home or about pages

  router$;

  @HostBinding('class.m-v3Topbar--isActivityV2')
  activityV2Feature: boolean = this.activityV2Experiment.isActive();

  constructor(
    protected sidebarService: SidebarNavigationService,
    protected themeService: ThemeService,
    protected configs: ConfigsService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected topbarService: TopbarService,
    protected router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    public pageLayoutService: PageLayoutService,
    private authModal: AuthModalService,
    private authRedirectService: AuthRedirectService,
    private guestModeExperiment: GuestModeExperimentService,
    protected activityV2Experiment: ActivityV2ExperimentService
  ) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');

    if (isPlatformBrowser(this.platformId)) {
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
    this.onHomepage =
      (url === '/' && !this.guestModeExperiment.isActive()) || url === '/about';
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
      this.router.navigate([this.authRedirectService.getRedirectUrl()]);
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
   * True if current theme is dark.
   * @returns { Observable<boolean> } - true if theme is dark, else false.
   */
  get isDarkTheme$(): Observable<boolean> {
    return this.themeService.isDark$;
  }
}
