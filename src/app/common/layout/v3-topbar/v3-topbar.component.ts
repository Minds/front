import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
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

  onAuthPages: boolean = false; // sets to false if we're on login or register pages

  router$;

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
    private featuresService: FeaturesService,
    private authModal: AuthModalService
  ) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');

    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
    }
  }

  ngOnInit() {
    this.loadComponent();
    this.topbarService.setContainer(this);
    this.session.isLoggedIn(() => this.detectChanges());
    this.listen();
  }

  getCurrentUser() {
    return this.session.getLoggedInUser();
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        NotificationsToasterComponent
      ),
      viewContainerRef = this.notificationsToasterHost.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
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
    this.sidebarService.toggle();
  }

  private listen() {
    this.setOnAuthPages(this.router.url);

    this.router$ = this.router.events.subscribe(
      (navigationEvent: NavigationEnd) => {
        if (navigationEvent instanceof NavigationEnd) {
          if (!navigationEvent.urlAfterRedirects) {
            return;
          }

          this.setOnAuthPages(
            navigationEvent.urlAfterRedirects || navigationEvent.url
          );
        }
      }
    );
  }

  private setOnAuthPages(url) {
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
    if (this.featuresService.has('onboarding-october-2020')) {
      try {
        await this.authModal.open();
      } catch (e) {
        if (e === 'DismissedModalException') {
          return; // modal dismissed, do nothing
        }
        console.error(e);
      }
      return;
    }
    this.router.navigate(['/register']);
  }

  /**
   * True if current theme is dark.
   * @returns { Observable<boolean> } - true if theme is dark, else false.
   */
  get isDarkTheme$(): Observable<boolean> {
    return this.themeService.isDark$;
  }
}
