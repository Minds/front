import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  HostBinding,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Navigation as NavigationService } from '../../../services/navigation';
import { Session } from '../../../services/session';
import { GroupsSidebarMarkersComponent } from '../../../modules/groups/sidebar-markers/sidebar-markers.component';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { SidebarNavigationService } from './navigation.service';
import { ConfigsService } from '../../services/configs.service';
import { MindsUser } from '../../../interfaces/entities';
import { FeaturesService } from '../../../services/features.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'm-sidebar--navigation',
  templateUrl: 'navigation.component.html',
})
export class SidebarNavigationComponent
  implements OnInit, AfterViewInit, OnDestroy {
  readonly cdnUrl: string;
  readonly cdnAssetsUrl: string;

  @ViewChild(DynamicHostDirective, { static: true })
  host: DynamicHostDirective;

  user;

  componentRef;
  groupsSidebar: GroupsSidebarMarkersComponent;

  layoutMode: 'phone' | 'tablet' | 'desktop' = 'desktop';

  settingsLink: string = '/settings';

  @HostBinding('class.m-sidebarNavigation--opened')
  isOpened: boolean = false;

  @HostBinding('hidden')
  hidden: boolean = false;

  groupSelectedSubscription: Subscription = null;
  plusPageActive: boolean = false;

  routerSubscription: Subscription;

  constructor(
    public navigation: NavigationService,
    public session: Session,
    private service: SidebarNavigationService,
    protected configs: ConfigsService,
    private _componentFactoryResolver: ComponentFactoryResolver,
    @Inject(PLATFORM_ID) private platformId: Object,
    private featuresService: FeaturesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cdnUrl = this.configs.get('cdn_url');
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
    this.service.setContainer(this);
    this.getUser();

    /**
     * Temporarily disable routerLinkActive class for the 'discovery' item so only 'discovery/plus' is highlighted
     * */
    this.routerSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: Event) => {
        if (event['url'].slice(0, 15) === '/discovery/plus') {
          this.plusPageActive = true;
        } else {
          this.plusPageActive = false;
        }
      });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
    }

    if (this.featuresService.has('navigation')) {
      this.settingsLink = '/settings/canary';
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createGroupsSideBar();
    }
  }

  ngOnDestroy(): void {
    if (this.groupSelectedSubscription) {
      this.groupSelectedSubscription.unsubscribe();
    }
  }

  getUser() {
    this.user = this.session.getLoggedInUser(user => {
      this.user = user;
    });
  }

  createGroupsSideBar() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
        GroupsSidebarMarkersComponent
      ),
      viewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.groupsSidebar = this.componentRef.instance;
    this.groupsSidebar.showLabels = true;
    this.groupsSidebar.leftSidebar = true;
    this.groupSelectedSubscription = this.componentRef.instance.onGroupSelected.subscribe(
      data => {
        if (data) {
          this.toggle();
        }
      }
    );
  }

  toggle(): void {
    if (this.layoutMode === 'phone') {
      this.isOpened = !this.isOpened;
    }
  }

  setVisible(value: boolean): void {
    this.hidden = !value;

    if (value) {
      if (isPlatformBrowser(this.platformId)) {
        this.createGroupsSideBar();
      }
    } else {
      this.host.viewContainerRef.clear();
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 1000) {
      this.layoutMode = 'desktop';
    } else if (window.innerWidth > 480 && window.innerWidth <= 1000) {
      this.layoutMode = 'tablet';
    } else {
      this.layoutMode = 'phone';
    }

    if (this.layoutMode !== 'phone') {
      this.isOpened = false;
    }

    if (this.groupsSidebar) {
      this.groupsSidebar.showLabels = this.layoutMode !== 'tablet';
    }
  }
}
