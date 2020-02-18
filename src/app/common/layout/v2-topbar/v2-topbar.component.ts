import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
  HostBinding,
} from '@angular/core';
import { Session } from '../../../services/session';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { NotificationsToasterComponent } from '../../../modules/notifications/toaster.component';
import { ThemeService } from '../../../common/services/theme.service';
import { ConfigsService } from '../../services/configs.service';
import { NavigationEnd, Router } from '@angular/router';
import { TopbarService } from '../topbar.service';

@Component({
  selector: 'm-v2-topbar',
  templateUrl: 'v2-topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2TopbarComponent implements OnInit, OnDestroy {
  readonly cdnAssetsUrl: string;
  timeout;
  isTouchScreen = false;
  forceBackground: boolean = true;
  showBackground: boolean = true;
  showSeparateLoginBtns: boolean = false;
  marketingPages: boolean = false;
  showTopbar: boolean = true;
  showBottombar: boolean = true;

  @ViewChild(DynamicHostDirective, { static: true })
  notificationsToasterHost: DynamicHostDirective;

  componentRef;
  componentInstance: NotificationsToasterComponent;

  onAuthPages: boolean = false; // sets to false if we're on login or register pages

  router$;

  constructor(
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private themeService: ThemeService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    configs: ConfigsService,
    protected topbarService: TopbarService,
    protected router: Router
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.loadComponent();
    this.session.isLoggedIn(() => this.detectChanges());

    this.listen();

    this.topbarService.setContainer(this);
  }

  toggleVisibility(visible: boolean) {
    this.showTopbar = visible;
    this.showBottombar = visible;
    this.detectChanges();
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

  /**
   * Marketing pages set this to true in order to change how the topbar looks
   * @param value
   * @param showBottombar
   */
  toggleMarketingPages(
    value: boolean,
    showBottombar = true,
    forceBackground: boolean = true
  ) {
    this.marketingPages = value;
    this.showSeparateLoginBtns = value;
    this.showBottombar = value && showBottombar;
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

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.router$) {
      this.router$.unsubscribe();
    }
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
}
