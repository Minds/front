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

@Component({
  selector: 'm-v3-topbar',
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

  isMobile: boolean = false;

  constructor(
    protected sidebarService: SidebarNavigationService,
    protected themeService: ThemeService,
    protected configs: ConfigsService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
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

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 540;
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
