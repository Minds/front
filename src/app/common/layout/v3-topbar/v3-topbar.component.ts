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
  forceBackground: boolean = true;
  showBackground: boolean = true;
  marketingPages: boolean = false;

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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');

    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
    }
  }

  ngOnInit() {
    this.loadComponent();
    this.session.isLoggedIn(() => this.detectChanges());

    this.topbarService.setContainer(this);

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

  touchStart() {
    this.isTouchScreen = true;
  }

  mouseEnter() {
    if (this.session.isLoggedIn()) {
      this.timeout = setTimeout(() => {
        if (!this.isTouchScreen) {
          this.themeService.toggleUserThemePreference();
        }
      }, 5000);
    }
  }

  mouseLeave() {
    clearTimeout(this.timeout);
  }

  toggleSidebarNav() {
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

  /**
   * Marketing pages set this to true in order to change how the topbar looks
   * @param value
   * @param forceBackground
   */
  toggleMarketingPages(value: boolean, forceBackground: boolean = true) {
    this.marketingPages = value;
    this.forceBackground = forceBackground;
    this.onScroll();
    this.detectChanges();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.showBackground = this.forceBackground
      ? true
      : this.marketingPages
      ? window.document.body.scrollTop > 52
      : true;
  }

  toggleVisibility(visible: boolean) {
    this.showTopbar = visible;
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
}
